import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserDataService } from './user-data.service';
import { User } from '../user/user.entity';
import WordLearnEntry from '../learn-status/dto/word-learn-entry.entity';

// Helper to create a mock QueryBuilder with chainable methods
function createMockQb<T extends object>() {
  const qb: Partial<jest.Mocked<SelectQueryBuilder<T>>> = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getCount: jest.fn(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    clone: jest.fn(),
  };
  (qb.clone as jest.Mock).mockReturnValue(qb);
  return qb as jest.Mocked<SelectQueryBuilder<T>>;
}

describe('UserDataService', () => {
  let service: UserDataService;
  let userRepo: jest.Mocked<Repository<User>>;
  let entryRepo: jest.Mocked<Repository<WordLearnEntry>>;

  beforeEach(async () => {
    const userRepoMock: Partial<jest.Mocked<Repository<User>>> = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const entryRepoMock: Partial<jest.Mocked<Repository<WordLearnEntry>>> = {
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDataService,
        { provide: getRepositoryToken(User), useValue: userRepoMock },
        { provide: getRepositoryToken(WordLearnEntry), useValue: entryRepoMock },
      ],
    }).compile();

    service = module.get(UserDataService);
    userRepo = module.get(getRepositoryToken(User));
    entryRepo = module.get(getRepositoryToken(WordLearnEntry));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getExpData should compute level progression correctly', () => {
    expect(service.getExpData(0)).toEqual({ level: 1, currentExp: 0, requiredExp: 10 });
    // exactly threshold -> next level, currentExp resets
    expect(service.getExpData(10)).toEqual({ level: 2, currentExp: 0, requiredExp: Math.floor(10 * 1.2) });
    // across multiple levels
    const res = service.getExpData(10 + Math.floor(10 * 1.2) + 5);
    expect(res.level).toBe(3);
    expect(res.currentExp).toBe(5);
  });

  it('giveExpToUser should load, modify and save user', async () => {
    const user: User = { id: 1, exp: 7 } as any;
    (userRepo.findOne as jest.Mock).mockResolvedValue({ ...user });
    (userRepo.save as jest.Mock).mockResolvedValue({ ...user, exp: 9 });

    await service.giveExpToUser(user, 2);

    expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    expect(userRepo.save).toHaveBeenCalledWith(expect.objectContaining({ exp: 9 }));
  });

  it('handleWordLearnedEvent should count only correct answers and give exp', async () => {
    const user: User = { id: 2, exp: 0 } as any;
    const spy = jest.spyOn(service, 'giveExpToUser').mockResolvedValue();

    await service.handleWordLearnedEvent(user, [
      { correct: true } as any,
      { correct: false } as any,
      { correct: true } as any,
    ]);

    expect(spy).toHaveBeenCalledWith(user, 2);
  });

  it('getLastPlayedMode should return last mode or null', async () => {
    const mode = 'SPEED_MODE' as any;
    (entryRepo.findOne as jest.Mock).mockResolvedValueOnce({ mode, date: new Date() } as any);

    const user: User = { id: 10 } as any;
    await expect(service.getLastPlayedMode(user)).resolves.toBe(mode);

    (entryRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.getLastPlayedMode(user)).resolves.toBeNull();

    expect(entryRepo.findOne).toHaveBeenCalledWith({ where: { user: { id: user.id } }, order: { date: 'DESC' } });
  });

  it('getStreak should count consecutive correct answers from latest until first incorrect', async () => {
    const user: User = { id: 3 } as any;
    (entryRepo.find as jest.Mock).mockResolvedValue([
      { correct: true } as any,
      { correct: true } as any,
      { correct: false } as any,
      { correct: true } as any,
    ]);

    await expect(service.getStreak('SPEED_MODE' as any, user)).resolves.toBe(2);
    expect(entryRepo.find).toHaveBeenCalledWith({
      where: { user: { id: user.id }, mode: 'SPEED_MODE' as any },
      order: { date: 'DESC' },
      take: 100,
    });
  });

  it('getUserProgress should aggregate totals and use getStreak', async () => {
    const user: User = { id: 5 } as any;
    (entryRepo.find as jest.Mock).mockResolvedValue([
      { correct: true } as any,
      { correct: false } as any,
      { correct: true } as any,
    ]);
    const streakSpy = jest.spyOn(service, 'getStreak').mockResolvedValue(4);

    const res = await service.getUserProgress('SPEED_MODE' as any, user);

    expect(res).toEqual({ streak: 4, allAnswers: 3, correctAnswers: 2 });
    expect(streakSpy).toHaveBeenCalledWith('SPEED_MODE' as any, user);
  });

  it('getLearningStats should compose query and return counts', async () => {
    const qb = createMockQb<WordLearnEntry>();
    (entryRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    qb.getCount.mockResolvedValueOnce(1); // today
    qb.getCount.mockResolvedValueOnce(7); // this week
    qb.getCount.mockResolvedValueOnce(20); // this month
    qb.getCount.mockResolvedValueOnce(100); // this year

    const user: User = { id: 9 } as any;
    const res = await service.getLearningStats(user);

    expect(entryRepo.createQueryBuilder).toHaveBeenCalledWith('entry');
    // basic where with user
    expect(qb.where).toHaveBeenCalledWith('entry.userId = :userId', { userId: user.id });
    expect(qb.andWhere).toHaveBeenCalledWith('correct = 1');
    expect(res).toEqual({ learnedToday: 1, learnedThisWeek: 7, learnedThisMonth: 20, learnedThisYear: 100 });
  });

  it('getUserStreak should compute streak across calendar days with gaps and no activity today -> 0', async () => {
    const qb = createMockQb<WordLearnEntry>();
    (entryRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    // Case A: today + yesterday => streak 2
    qb.getRawMany.mockResolvedValueOnce([
      { date: today.toISOString().slice(0, 10) },
      { date: yesterday.toISOString().slice(0, 10) },
      { date: threeDaysAgo.toISOString().slice(0, 10) }, // gap of 2 breaks here
    ] as any);
    let res = await service.getUserStreak({ id: 11 } as any);
    expect(res).toBe(2);

    // Case B: last activity 2+ days ago => 0
    const fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(today.getDate() - 4);
    qb.getRawMany.mockResolvedValueOnce([{ date: fourDaysAgo.toISOString().slice(0, 10) }] as any);
    res = await service.getUserStreak({ id: 11 } as any);
    expect(res).toBe(0);
  });
});
