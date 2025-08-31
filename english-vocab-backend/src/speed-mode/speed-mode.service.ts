import { Injectable } from '@nestjs/common';
import GameWord from '../words/game-word.dto';
import { InjectRepository } from '@nestjs/typeorm';
import WordEntity from '../words/word.entity';
import { Repository } from 'typeorm';
import { WordsService } from '../words/words.service';
import { User } from '../user/user.entity';

@Injectable()
export class SpeedModeService {
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordsRepository: Repository<WordEntity>,
    private readonly wordsService: WordsService,
  ) {
    // empty
  }

  async getNextWords(user: User): Promise<GameWord[]> {
    const randomWords = await this.wordsRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.learnStatuses', 'learnStatus', 'learnStatus.userId = :userId', { userId: user.id })
      .where('CHAR_LENGTH(word.word_en) < 20')
      .select()
      .orderBy('RAND()')
      .limit(20)
      .getMany();

    console.log('nextWords');

    const result: GameWord[] = [];

    for (const word of randomWords) {
      const similarWords = await this.wordsService.findSimilarEnWords(word);
      const similarPlWords = await this.wordsService.findSimilarPlWords(word);

      result.push({
        word,
        similarEnWords: similarWords.map((w) => w.word_en),
        similarPlWords: similarPlWords.map((w) => w.word_pl),
        wordLearnStatus: word.learnStatuses?.[0],
      });
    }

    return result;
  }
}
