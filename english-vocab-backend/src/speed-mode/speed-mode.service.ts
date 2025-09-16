import { Injectable, Logger } from '@nestjs/common';
import GameWord from '../words/game-word.dto';
import { InjectRepository } from '@nestjs/typeorm';
import WordEntity from '../words/word.entity';
import { Repository } from 'typeorm';
import { WordsService } from '../words/words.service';
import { User } from '../user/user.entity';

@Injectable()
export class SpeedModeService {
  private readonly logger = new Logger(SpeedModeService.name);

  constructor(
    @InjectRepository(WordEntity)
    private readonly wordsRepository: Repository<WordEntity>,
    private readonly wordsService: WordsService,
  ) {
    // empty
  }

  async getNextWords(user: User): Promise<GameWord[]> {
    this.logger.log(`Generating next words for user ${user.id}`);
    const randomWords = await this.wordsRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.learnStatuses', 'learnStatus', 'learnStatus.userId = :userId', { userId: user.id })
      .where('CHAR_LENGTH(word.word_en) < 20')
      .select()
      .orderBy('RAND()')
      .limit(20)
      .getMany();

    this.logger.debug(`Fetched ${randomWords.length} random words for user ${user.id}`);

    const result: GameWord[] = [];

    for (const word of randomWords) {
      const similarWords = await this.wordsService.findSimilarEnWords(word);
      const similarPlWords = await this.wordsService.findSimilarPlWords(word);

      result.push({
        word,
        similarEnWords: similarWords.map((w) => w.word_en),
        similarPlWords: similarPlWords.map((w) => w.word_pl),
        wordLearnEntry: word.learnStatuses?.[0],
      });
    }

    this.logger.log(`Prepared ${result.length} game words for user ${user.id}`);
    return result;
  }
}
