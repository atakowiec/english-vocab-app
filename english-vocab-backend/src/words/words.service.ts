import { Injectable } from '@nestjs/common';
import Word from './word.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private readonly repository: Repository<Word>,
  ) {
    // empty
  }

  async save(word: Omit<Word, 'id'>) {
    return await this.repository.save(word);
  }
}
