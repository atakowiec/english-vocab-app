import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { LearnStatusService } from './learn-status.service';
import WordLearnEntry from './dto/word-learn-entry.entity';
import { GivenAnswerInput } from './dto/given-answer.input';
import { User } from '../user/user.entity';

// Align with the global type in src/app.d.ts
type LearnMode = 'SPEED_MODE';

describe('LearnStatusService', () => {
  let service: LearnStatusService;
  let repo: jest.Mocked<Partial<Repository<WordLearnEntry>>>;
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
        LearnStatusService,
        { provide: getRepositoryToken(WordLearnEntry), useValue: repo },
        { provide: EventEmitter2, useValue: emitter },
      ],
    }).compile();

    service = module.get<LearnStatusService>(LearnStatusService);

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
    const user: User = { id: 42, email: 'x@y.com', name: 'john', password: 'p', wordLearnEntries: [], exp: 0 } as User;

    const date1 = new Date('2025-01-01T10:00:00.000Z');
    const date2 = new Date('2025-01-02T12:30:00.000Z');

    const answers: GivenAnswerInput[] = [
      { word_id: 1, correct: true, date: date1, learnMode: 'SPEED_MODE' as LearnMode },
      { word_id: 2, correct: false, date: date2, learnMode: 'SPEED_MODE' as LearnMode },
    ];

    await service.saveAnswers(user, answers);

    expect(Logger.prototype.log).toHaveBeenCalledWith('Saving 2 answers for user 42');

    expect(repo.save).toHaveBeenCalledTimes(2);

    expect(repo.save).toHaveBeenNthCalledWith(1, {
      user,
      word: { id: 1 },
      date: date1,
      correct: true,
      mode: 'SPEED_MODE',
    });

    expect(repo.save).toHaveBeenNthCalledWith(2, {
      user,
      word: { id: 2 },
      date: date2,
      correct: false,
      mode: 'SPEED_MODE',
    });

    expect(emitter.emit).toHaveBeenCalledTimes(1);
    expect(emitter.emit).toHaveBeenCalledWith('words.learned', user, answers);
  });

  it('saveAnswers with empty list should not call save but still emit event', async () => {
    const user: User = { id: 7, email: 'a@b.com', name: 'amy', password: 'z', wordLearnEntries: [], exp: 0 } as User;

    await service.saveAnswers(user, []);

    expect(Logger.prototype.log).toHaveBeenCalledWith('Saving 0 answers for user 7');
    expect(repo.save).not.toHaveBeenCalled();
    expect(emitter.emit).toHaveBeenCalledWith('words.learned', user, []);
  });
});
