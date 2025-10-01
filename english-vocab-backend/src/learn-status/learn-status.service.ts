import { Injectable, Logger } from '@nestjs/common';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import WordLearnEntry from './dto/word-learn-entry.entity';
import { Repository } from 'typeorm';
import { GivenAnswerInput } from './dto/given-answer.input';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LearnStatusService {
  private readonly logger = new Logger(LearnStatusService.name);

  constructor(
    @InjectRepository(WordLearnEntry)
    private readonly learnEntryRepository: Repository<WordLearnEntry>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    // empty
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

    this.eventEmitter.emit('words.learned', user, answers);
  }
}
