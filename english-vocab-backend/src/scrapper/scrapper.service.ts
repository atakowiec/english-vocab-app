import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import WordStatus from './word-status.entity';
import { In, Repository } from 'typeorm';
import { defaultWords } from './default-words';
import { evaluate, FetchResponse, openPage } from '../utils/puppeteer.util';
import { WordsService } from '../words/words.service';
import WordEntity from '../words/word.entity';
import { lemmatize, LemmatizerType } from '../utils/lemmatizer.util';

@Injectable()
export class ScrapperService {
  constructor(
    @InjectRepository(WordStatus)
    private readonly wordStatusRepository: Repository<WordStatus>,
    private readonly wordsService: WordsService,
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

    console.log(`saved ${newWords.length} words`);
    console.log(newWords);
  }

  async loadDefaultWords() {
    const words = [...new Set(defaultWords.map((w) => w.toLowerCase()))];

    await this.wordStatusRepository.save(words.map((word) => ({ word, fetched: false })));
  }

  async fetchNextWord(): Promise<WordEntity[] | null> {
    let wordText = await this.getNextWord();
    console.log(`@------------------------------------------------------@`);
    console.log('FETCHING WORD:', wordText);

    if (!wordText) return null;

    const fetchResponse = await this.scrapeWord(wordText);
    await this.saveWords(fetchResponse.toFetch);

    if (await this.isFetched(fetchResponse.urlWord)) {
      console.log(`url word already fetched: ${fetchResponse.urlWord}`);
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
          tags: word.tags.join('\n'),
          examples: word.examples.join('\n'),
          other_forms: word.otherForms.join('\n'),
          learnStatuses: [],
        }),
      );
      infos.push(`saved word: ${word.word ?? wordText} - ${word.translation} - ${word.type}`);
    }

    for (const word of toUpdateStatus) {
      await this.updateWordStatus(word, true);
    }
    console.log(`updated status for: `, toUpdateStatus);

    console.log(infos);

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
}
