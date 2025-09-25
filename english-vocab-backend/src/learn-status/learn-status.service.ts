import { Injectable, Logger } from '@nestjs/common';
import { LearnMode } from './learn-mode';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import WordLearnEntry from './word-learn-entry.entity';
import { Repository } from 'typeorm';
import ModeProgressDto from './mode-progress.dto';
import { GivenAnswerInput } from './given-answer.input';

@Injectable()
export class LearnStatusService {
  private readonly logger = new Logger(LearnStatusService.name);

  constructor(
    @InjectRepository(WordLearnEntry)
    private readonly learnEntryRepository: Repository<WordLearnEntry>,
  ) {
    // empty
  }

  async getUserProgress(learnMode: LearnMode, user: User): Promise<ModeProgressDto> {
    return {
      streak: this.getStreak(learnMode, user),
      allAnswers: 0, // todo
      correctAnswers: 0, // todo
    };
  }

  getStreak(learnMode: LearnMode, user: User): number {
    return 9; // todo
  }

  async saveAnswers(user: User, answers: GivenAnswerInput[]) {
    this.logger.log(`Saving ${answers.length} answers for user ${user.id}`);
    for (const answer of answers) {
      await this.learnEntryRepository.save({
        user,
        word: {
          id: answer.word_id,
        },
        date: answer.date,
        correct: answer.correct,
        mode: answer.learnMode.toString(),
      });
    }
  }
}
