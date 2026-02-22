import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { LearningService } from './learning.service';
import LearnEntry from './entity/learn-entry.entity';
import { GivenAnswerInput } from './dto/given-answer.input';
import { User } from '../user/user.entity';
import { Language, LearningSubMode } from '../app.types';

describe('LearningService', () => {
  let service: LearningService;
  let repo: jest.Mocked<Partial<Repository<LearnEntry>>>;
  let emitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    repo = {
      save: jest.fn(),
    };
    emitter = {
      emit: jest.fn(),
      // other methods not used in tests can be left undefined
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningService,
        { provide: getRepositoryToken(LearnEntry), useValue: repo },
        { provide: EventEmitter2, useValue: emitter },
      ],
    }).compile();

    service = module.get<LearningService>(LearningService);

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('saveAnswers should persist each answer and emit words.learned event', async () => {
    const user: User = { id: 42, email: 'x@y.com', name: 'john', password: 'p', sessions: [], exp: 0 } as User;

    const date1 = new Date('2025-01-01T10:00:00.000Z');
    const date2 = new Date('2025-01-02T12:30:00.000Z');

    const answers: GivenAnswerInput[] = [
      {
        word_id: 1,
        correct: true,
        date: date1,
        learnMode: 'SPEED_TEST' as LearningSubMode,
        distractors: [],
        language: 'pl' as Language,
      },
      {
        word_id: 2,
        correct: false,
        date: date2,
        learnMode: 'SPEED_TEST' as LearningSubMode,
        distractors: [],
        language: 'pl' as Language,
      },
    ];

    await service.saveAnswers(user, answers);

    expect(Logger.prototype.log).toHaveBeenCalledWith('Saving 2 answers for user 42');

    expect(repo.save).toHaveBeenCalledTimes(2);

    expect(repo.save).toHaveBeenNthCalledWith(1, {
      user,
      word: { id: 1 },
      date: date1,
      correct: true,
      mode: 'SPEED_TEST',
    });

    expect(repo.save).toHaveBeenNthCalledWith(2, {
      user,
      word: { id: 2 },
      date: date2,
      correct: false,
      mode: 'SPEED_TEST',
    });

    expect(emitter.emit).toHaveBeenCalledTimes(1);
    expect(emitter.emit).toHaveBeenCalledWith('words.learned', user, answers);
  });

  it('saveAnswers with empty list should not call save but still emit event', async () => {
    const user: User = { id: 7, email: 'a@b.com', name: 'amy', password: 'z', exp: 0, sessions: [] } as User;

    await service.saveAnswers(user, []);

    expect(Logger.prototype.log).toHaveBeenCalledWith('Saving 0 answers for user 7');
    expect(repo.save).not.toHaveBeenCalled();
    expect(emitter.emit).toHaveBeenCalledWith('words.learned', user, []);
  });
});
