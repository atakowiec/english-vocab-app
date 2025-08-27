import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import WordStatus from './word-status.entity';
import { In, Repository } from 'typeorm';
import { defaultWords } from './default-words';
import { evaluate, FetchResponse, openPage } from '../utils/puppeteer.util';
import { WordsService } from '../words/words.service';
import Word from '../words/word.entity';

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

    if (wordStatus) {
      return wordStatus.word;
    } else {
      return null;
    }
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

  async fetchNextWord(): Promise<Word[] | null> {
    const wordText = await this.getNextWord();
    console.log('fetching word:', wordText);

    if (!wordText) return null;

    const fetchResponse: FetchResponse = await this.scrapeWord(wordText);
    await this.saveWords(fetchResponse.toFetch);

    const toUpdateStatus: Set<string> = new Set();
    const saved: Word[] = [];
    const infos: string[] = [];

    toUpdateStatus.add(wordText);
    for (const word of fetchResponse.words) {
      if (!word.translation) continue;

      for (const otherWord of word.otherForms) {
        toUpdateStatus.add(otherWord.toLowerCase());
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
        }),
      );
      infos.push(`saved word: ${word.word ?? wordText} - ${word.translation} - ${word.type}`);
    }

    for (const word of toUpdateStatus) {
      await this.updateWordStatus(word, true);
    }

    console.log(infos);

    return saved;
  }

  async scrapeWord(word: string) {
    const page = await openPage(`https://dictionary.cambridge.org/dictionary/english-polish/${word}`);
    const response: FetchResponse = await page.evaluate(evaluate);

    return response;
  }
}
