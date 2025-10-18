import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import WordEntity from './word.entity';
import { WordsService } from './words.service';
import { WordReport } from './word-report.entity';

describe('WordsService', () => {
  let service: WordsService;
  let repository: jest.Mocked<Repository<WordEntity>>;

  beforeEach(async () => {
    const repositoryMock: Partial<jest.Mocked<Repository<WordEntity>>> = {
      save: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: getRepositoryToken(WordEntity),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(WordReport),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WordsService>(WordsService);
    repository = module.get(getRepositoryToken(WordEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('save() should delegate to repository.save', async () => {
    const word: Omit<WordEntity, 'id'> = {
      word_en: 'test',
      word_pl: 'test-pl',
      base_word_en: 'test',
      definition_en: 'def',
      type: 'noun',
      tags: [],
      examples: [],
      other_forms: [],
      learnStatuses: [],
    };

    const saved: WordEntity = { id: 1, ...word, learnStatuses: undefined } as any;
    repository.save.mockResolvedValue(saved);

    await expect(service.save(word)).resolves.toBe(saved);
    expect(repository.save).toHaveBeenCalledWith(word);
  });

  function mockQb() {
    const qb: Partial<jest.Mocked<SelectQueryBuilder<WordEntity>>> = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    };
    (repository.createQueryBuilder as jest.Mock).mockReturnValue(qb);
    return qb as jest.Mocked<SelectQueryBuilder<WordEntity>>;
  }

  it('findSimilarEnWords() should build query with correct constraints and return results', async () => {
    const word = {
      id: 123,
      word_en: 'apple',
      word_pl: 'jablko',
      base_word_en: 'apple',
      type: 'noun',
    } as WordEntity;

    const qb = mockQb();
    const expected: WordEntity[] = [
      { ...(word as any), id: 2 } as any,
      { ...(word as any), id: 3 } as any,
      { ...(word as any), id: 4 } as any,
    ];
    qb.getMany.mockResolvedValue(expected);

    const result = await service.findSimilarEnWords(word);

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('word');
    expect(qb.where).toHaveBeenCalledWith('CHAR_LENGTH(word.word_en) BETWEEN :length_min AND :length_max', {
      length_min: word.word_en.length - 1,
      length_max: word.word_en.length + 1,
    });
    expect(qb.andWhere).toHaveBeenCalledWith('word.base_word_en != :baseWord', { baseWord: word.base_word_en });
    expect(qb.andWhere).toHaveBeenCalledWith('word.type = :type', { type: word.type });
    expect(qb.orderBy).toHaveBeenCalledWith('RAND()');
    expect(qb.limit).toHaveBeenCalledWith(3);
    expect(qb.getMany).toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it('findSimilarPlWords() should build query with correct constraints and return results', async () => {
    const word = {
      id: 1,
      word_en: 'cat',
      word_pl: 'kot',
      base_word_en: 'cat',
      type: 'noun',
    } as WordEntity;

    const qb = mockQb();
    const expected: WordEntity[] = [{ ...(word as any), id: 5 } as any];
    qb.getMany.mockResolvedValue(expected);

    const result = await service.findSimilarPlWords(word);

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('word');
    expect(qb.where).toHaveBeenCalledWith('CHAR_LENGTH(word.word_pl) BETWEEN :length_min AND :length_max', {
      length_min: word.word_pl.length - 1,
      length_max: word.word_pl.length + 1,
    });
    expect(qb.andWhere).toHaveBeenCalledWith('word.base_word_en != :baseWord', { baseWord: word.base_word_en });
    expect(qb.andWhere).toHaveBeenCalledWith('word.type = :type', { type: word.type });
    expect(qb.orderBy).toHaveBeenCalledWith('RAND()');
    expect(qb.limit).toHaveBeenCalledWith(3);
    expect(qb.getMany).toHaveBeenCalled();
    expect(result).toBe(expected);
  });

  it('getAll() should call repository.find', async () => {
    const expected: WordEntity[] = [{ id: 1 } as any, { id: 2 } as any];
    repository.find.mockResolvedValue(expected);

    await expect(service.getAll()).resolves.toBe(expected);
    expect(repository.find).toHaveBeenCalled();
  });

  it('getWordOfTheDay() should compute deterministic offset and return one word', async () => {
    const qb = mockQb();
    repository.count.mockResolvedValue(10);

    const word: WordEntity = { id: 7 } as any;
    qb.getOne.mockResolvedValue(word);

    const spyDateNow = jest.spyOn(Date, 'now').mockReturnValue(86400000 * 3.5); // 3 days

    const result = await service.getWordOfTheDay();

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('word');
    expect(qb.orderBy).toHaveBeenCalledWith('word.id');
    expect(qb.offset).toHaveBeenCalledWith(3 % 10);
    expect(qb.limit).toHaveBeenCalledWith(1);
    expect(qb.getOne).toHaveBeenCalled();
    expect(result).toBe(word);

    spyDateNow.mockRestore();
  });

  it('getWordOfTheDay() should throw when repository returns no word', async () => {
    const qb = mockQb();
    repository.count.mockResolvedValue(5);
    // @ts-ignore
    qb.getOne.mockResolvedValue(undefined);

    await expect(service.getWordOfTheDay()).rejects.toThrow('No words in the database');
    expect(repository.createQueryBuilder).toHaveBeenCalledWith('word');
  });
});
