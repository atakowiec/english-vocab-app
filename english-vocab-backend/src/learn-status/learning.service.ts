import { HttpException, Injectable, Logger } from '@nestjs/common';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import LearnEntry from './entity/learn-entry.entity';
import { Repository } from 'typeorm';
import { GivenAnswerInput } from './dto/given-answer.input';
import { EventEmitter2 } from '@nestjs/event-emitter';
import LearningSession from './entity/learning-session.entity';
import { WordsService } from '../words/words.service';
import GameWord from '../words/dto/game-word.dto';
import { LearningMode } from '../app.types';

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  constructor(
    @InjectRepository(LearnEntry)
    private readonly learnEntryRepository: Repository<LearnEntry>,
    @InjectRepository(LearningSession)
    private readonly sessionRepository: Repository<LearningSession>,
    private readonly eventEmitter: EventEmitter2,
    private readonly wordsService: WordsService,
  ) {
    // empty
  }

  async saveAnswers(user: User, answers: GivenAnswerInput[]) {
    this.logger.log(`Saving ${answers.length} answers for user ${user.id}`);

    const session = await this.getActiveSessionOrThrow(user);

    for (const answer of answers) {
      await this.learnEntryRepository.save({
        session,
        word: {
          id: answer.word_id,
        },
        date: answer.date,
        correct: answer.correct,
        mode: answer.learnMode,
        language: answer.language,
        distractors: answer.distractors,
      });
    }

    this.eventEmitter.emit('words.learned', user, answers);
  }

  public async getActiveSessionOrThrow(user: User): Promise<LearningSession> {
    const session = await this.getActiveSession(user);
    if (!session) throw new HttpException('No active learning session found', 404);

    return session;
  }

  public async getActiveSessionOrCreate(user: User, mode: LearningMode): Promise<LearningSession> {
    const session = await this.getActiveSession(user);
    if (session) return session;

    return await this.newSession(user, mode);
  }

  public async getActiveSession(user: User): Promise<LearningSession | null> {
    return await this.sessionRepository.findOne({
      where: { user, active: true },
      order: { session_start: 'DESC' },
    });
  }

  /**
   * Marks all active sessions for the given user as ended.
   * It's just a safety measure to ensure no overlapping sessions exist.
   * @param user
   * @private
   */
  private async markAllSessionsAsEnded(user: User) {
    const notEnded = await this.sessionRepository.find({
      where: { user, active: true },
    });

    if (notEnded.length == 0) return;

    await this.sessionRepository.update(
      notEnded.map((s) => s.id),
      { active: false },
    );
  }

  /**
   * Creates a new learning session for the given user and mode.
   * Learning session is a single "opening" of any learning mode.
   * Returns the session ID.
   * @param user
   * @param mode
   */
  async newSession(user: User, mode: LearningMode): Promise<LearningSession> {
    await this.markAllSessionsAsEnded(user);

    return await this.sessionRepository.save({
      user,
      session_start: new Date(),
      mode: mode,
      active: true,
    });
  }

  /**
   * Ends an active session for the given user and session ID by marking it as inactive.
   *
   * @param {User} user - The user associated with the session to be ended.
   * @param {number} sessionId - The unique identifier of the session to be ended.
   * @return {Promise<void>} A promise that resolves when the session is successfully marked as inactive and saved.
   */
  async endSession(user: User, sessionId: number): Promise<void> {
    const session = await this.sessionRepository.findOne({ where: { id: sessionId, user } });

    if (!session) return;

    session.active = false;
    await this.sessionRepository.save(session);
  }

  async getWords(mode: LearningMode, user: User): Promise<GameWord[]> {
    await this.getActiveSessionOrCreate(user, mode);

    switch (mode) {
      case 'SPEED_TEST':
        return await this.wordsService.getWordsForSpeedMode(user);
      case 'LEARNING':
        return await this.wordsService.getWordsForLearningMode(user);
      default:
        throw new Error(`Unknown learn mode: ${mode}`);
    }
  }
}
