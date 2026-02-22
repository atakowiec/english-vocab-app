import { Injectable, Logger } from '@nestjs/common';
import WordEntity from './dto/word.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import GameWord from './dto/game-word.dto';
import { User } from '../user/user.entity';
import { WordReport } from './dto/word-report.entity';

@Injectable()
export class WordsService {
  private readonly logger = new Logger(WordsService.name);
  constructor(
    @InjectRepository(WordEntity)
    private readonly repository: Repository<WordEntity>,
    @InjectRepository(WordReport)
    private readonly reportRepository: Repository<WordReport>,
  ) {
    // empty
  }

  async save(word: Omit<WordEntity, 'id'>) {
    return await this.repository.save(word);
  }

  async findSimilarEnWords(word: WordEntity): Promise<WordEntity[]> {
    return await this.repository
      .createQueryBuilder('word')
      .where('CHAR_LENGTH(word.word_en) BETWEEN :length_min AND :length_max', {
        length_min: word.word_en.length - 1,
        length_max: word.word_en.length + 1,
      })
      .andWhere('word.base_word_en != :baseWord', { baseWord: word.base_word_en })
      .andWhere('word.type = :type', { type: word.type })
      .orderBy('RAND()')
      .limit(3)
      .getMany();
  }

  async findSimilarPlWords(word: WordEntity) {
    return await this.repository
      .createQueryBuilder('word')
      .where('CHAR_LENGTH(word.word_pl) BETWEEN :length_min AND :length_max', {
        length_min: word.word_pl.length - 1,
        length_max: word.word_pl.length + 1,
      })
      .andWhere('word.base_word_en != :baseWord', { baseWord: word.base_word_en })
      .andWhere('word.type = :type', { type: word.type })
      .orderBy('RAND()')
      .limit(3)
      .getMany();
  }

  async getAll() {
    return await this.repository.find();
  }

  async getWordOfTheDay() {
    const now = new Date();
    const localMillis = now.getTime() - now.getTimezoneOffset() * 60_000;
    const dayOfTheCentury = Math.floor(localMillis / 86_400_000) * 69;

    const all = await this.repository.count();

    const word = await this.repository
      .createQueryBuilder('word')
      .orderBy('word.id')
      .offset(dayOfTheCentury % all)
      .limit(1)
      .getOne();

    if (!word) {
      throw new Error('No words in the database');
    }

    return word;
  }

  async getWordsForLearningMode(user: User) {
    return await this.getWordsForSpeedMode(user); // todo
  }

  async getWordsForSpeedMode(user: User): Promise<GameWord[]> {
    const randomWords = await this.repository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.learnEntries', 'learnEntry')
      .leftJoinAndSelect('learnEntry.session', 'session', 'session.userId = :userId', { userId: user.id })
      .where('CHAR_LENGTH(word.word_en) < 20')
      .andWhere('word.banned = false')
      .orderBy('RAND()')
      .limit(20)
      .getMany();

    const result: GameWord[] = [];

    for (const word of randomWords) {
      const similarWords = await this.findSimilarEnWords(word);
      const similarPlWords = await this.findSimilarPlWords(word);

      result.push({
        word,
        similarEnWords: similarWords.map((w) => w.word_en),
        similarPlWords: similarPlWords.map((w) => w.word_pl),
        learnEntries: word.learnEntries
      });
    }

    return result;
  }

  async saveWordReport(wordId: number, reason: string, user: User) {
    this.logger.log(`Saving word report for word ${wordId} by user ${user.id}`);

    const word = await this.repository.findOne({ where: { id: wordId } });
    if (!word) {
      this.logger.warn(`Word with id ${wordId} not found`);
      return; // we don't need to tell the user that the word doesn't exist
    }

    // Use a transaction to ensure both operations succeed or fail together
    await this.reportRepository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(WordReport, { word, user, reason });
      await transactionalEntityManager.update(WordEntity, { id: wordId }, { banned: true });
    });
  }
}
