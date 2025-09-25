import { Injectable } from '@nestjs/common';
import WordEntity from './word.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(WordEntity)
    private readonly repository: Repository<WordEntity>,
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
    const dayOfTheCentury = Math.floor(Date.now() / 86400000);

    const word = await this.repository
      .createQueryBuilder('word')
      .orderBy('MOD(word.id, :dayOfTheCentury)', 'DESC')
      .setParameter('dayOfTheCentury', dayOfTheCentury)
      .getOne();

    if (!word) {
      throw new Error('No words in the database');
    }

    return word;
  }
}
