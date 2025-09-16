import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import WordStatus from './word-status.entity';
import { In, Repository } from 'typeorm';
import { defaultWords } from './default-words';
import { evaluate, FetchResponse, openPage } from '../utils/puppeteer.util';
import { WordsService } from '../words/words.service';
import WordEntity from '../words/word.entity';
import { lemmatize, LemmatizerType } from '../utils/lemmatizer.util';
import { ConfigService } from '@nestjs/config';
import { RelatedWordsResponse } from '../types/wordnik';

@Injectable()
export class ScrapperService {
  private readonly logger = new Logger(ScrapperService.name);
  readonly otherFormsCache = new Map<string, string[]>();

  constructor(
    @InjectRepository(WordStatus)
    private readonly wordStatusRepository: Repository<WordStatus>,
    private readonly wordsService: WordsService,
    private readonly configService: ConfigService,
  ) {
    // empty
  }

  async updateWordStatus(word: string, fetched: boolean) {
    const wordStatus = await this.wordStatusRepository.findOne({
      where: { word },
    });

    if (!wordStatus) {
      await this.wordStatusRepository.save({ word, fetched });
    } else {
      wordStatus.fetched = fetched;
      await this.wordStatusRepository.save(wordStatus);
    }
  }

  async getNextWord(): Promise<string | null> {
    const wordStatus = await this.wordStatusRepository.findOne({
      where: { fetched: false },
      order: { id: 'ASC' },
    });

    if (!wordStatus) {
      return null;
    }

    return wordStatus.word;
  }

  async saveWords(words: string[]): Promise<void> {
    // filter out duplicates
    words = [...new Set(words)];

    // filter out items in the database
    const existingWords = await this.wordStatusRepository.find({
      where: { word: In(words) },
    });

    const newWords = words.filter((word) => !existingWords.some((w) => w.word === word));

    await this.wordStatusRepository.save(newWords.map((word) => ({ word, fetched: false })));

    this.logger.log(`Saved ${newWords.length} new words`);
    this.logger.debug(`New words: ${JSON.stringify(newWords)}`);
  }

  async loadDefaultWords() {
    const words = [...new Set(defaultWords.map((w) => w.toLowerCase()))];

    await this.wordStatusRepository.save(words.map((word) => ({ word, fetched: false })));
  }

  async fetchNextWord(): Promise<WordEntity[] | null> {
    let wordText = await this.getNextWord();
    this.logger.log(`Fetching next word: ${wordText}`);

    if (!wordText) return null;

    const fetchResponse = await this.scrapeWord(wordText);
    await this.saveWords(fetchResponse.toFetch);

    if (await this.isFetched(fetchResponse.urlWord)) {
      this.logger.debug(`URL word already fetched: ${fetchResponse.urlWord}`);
      await this.updateWordStatus(wordText, true);
      return this.fetchNextWord();
    }

    const toUpdateStatus: Set<string> = new Set();
    const saved: WordEntity[] = [];
    const infos: string[] = [];

    toUpdateStatus.add(wordText.toLowerCase());
    toUpdateStatus.add(fetchResponse.urlWord.toLowerCase());

    wordText = fetchResponse.urlWord; // when we search for another form of a word (e.g., worked) and cambridge redirects us to the base word, we need to use the base word

    for (const word of fetchResponse.words) {
      if (!word.translation) continue;

      for (const otherWord of word.otherForms) {
        toUpdateStatus.add(otherWord.toLowerCase());
      }

      let base_word = wordText;
      // check if the lemmatized word is already in the database - and check its status
      if (word.type && ['noun', 'verb', 'adjective'].includes(word.type)) {
        base_word = lemmatize(base_word, word.type as LemmatizerType);

        const lemma = lemmatize(word.word ?? wordText, word.type as LemmatizerType);
        infos.push(`lemma: ${lemma} for word: ${word.word ?? wordText}`);

        if (await this.isFetched(lemma)) {
          infos.push(
            `skipped word (lemma already fetched): ${word.word ?? wordText} - ${word.translation} - ${word.type} - lemma: ${lemma}`,
          );
          continue;
        }
      }

      saved.push(
        await this.wordsService.save({
          type: word.type,
          definition_en: word.definition,
          word_en: word.word ?? wordText,
          word_pl: word.translation,
          base_word_en: wordText,
          tags: word.tags,
          examples: word.examples,
          other_forms: word.otherForms,
          learnStatuses: [],
        }),
      );
      infos.push(`saved word: ${word.word ?? wordText} - ${word.translation} - ${word.type}`);
    }

    for (const word of toUpdateStatus) {
      await this.updateWordStatus(word, true);
    }
    this.logger.debug(`Updated status for: ${JSON.stringify([...toUpdateStatus])}`);

    this.logger.debug(`Infos: ${JSON.stringify(infos)}`);

    return saved;
  }

  async scrapeWord(word: string) {
    const page = await openPage(`https://dictionary.cambridge.org/dictionary/english-polish/${word}`);
    const response: FetchResponse = await page.evaluate(evaluate);
    const url = page.url();
    const urlWord = url.split('/dictionary/english-polish/')[1].split('?')[0];

    return {
      urlWord,
      ...response,
    };
  }

  async getWordStatus(word: string): Promise<WordStatus | null> {
    return await this.wordStatusRepository.findOne({
      where: { word },
    });
  }

  async isFetched(word: string): Promise<boolean> {
    const wordStatus = await this.getWordStatus(word);
    return !!wordStatus?.fetched;
  }

  async getOtherForms(word: string): Promise<string[]> {
    const cached = this.otherFormsCache.get(word);
    if (cached) {
      this.logger.debug(`Cached other forms for word: ${word}`);
      return cached;
    }

    const API_KEY = this.configService.get('WORDNIK_API_KEY');

    const response = await fetch(
      `https://api.wordnik.com/v4/word.json/${word}/relatedWords?api_key=${API_KEY}&relationshipTypes=verb-form`,
    );
    if (response.status != 200) {
      this.logger.warn(`Error fetching other forms for word: ${word} - status ${response.status}`);
      return [word];
    }

    const data: RelatedWordsResponse = await response.json();
    const result = new Set<string>();
    result.add(word);

    this.logger.debug(`Wordnik relatedWords for ${word}: ${JSON.stringify(data)}`);

    for (const relationship of data) {
      if (['variant', 'verb-form'].includes(relationship.relationshipType)) {
        for (const w of relationship.words) {
          result.add(w);
        }
      }
    }

    this.otherFormsCache.set(word, [...result]);

    return [...result];
  }

  async saveOtherForms(word: WordEntity) {
    word.other_forms = [...new Set([...(word.other_forms ?? []), ...(await this.getOtherForms(word.word_en))])];
    await this.wordsService.save(word);

    this.logger.log(`Saved other forms for word: ${word.id}. ${word.word_en}`);
  }

  async updateOtherFormsForAllWords() {
    const allWords = await this.wordsService.getAll();

    const batchSize = 2;

    for (let i = 0; i < allWords.length; i += batchSize) {
      const batch = allWords.slice(i, i + batchSize);

      // run 20 tasks concurrently
      await Promise.all(batch.map((word) => this.saveOtherForms(word)));
    }

    this.logger.log('Finished updating other forms for all words');
  }
}
