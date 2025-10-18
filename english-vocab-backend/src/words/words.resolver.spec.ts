import { Test, TestingModule } from '@nestjs/testing';
import { WordsResolver } from './words.resolver';
import { WordsService } from './words.service';

describe('WordsResolver', () => {
  let resolver: WordsResolver;
  const wordsService = {
    getWordOfTheDay: jest.fn(),
  } as unknown as WordsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsResolver,
        { provide: WordsService, useValue: wordsService },
      ],
    }).compile();

    resolver = module.get<WordsResolver>(WordsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('wordOfTheDay should delegate to wordsService.getWordOfTheDay and return its result', async () => {
    const word = { id: 42, word_en: 'test' } as any;
    (wordsService.getWordOfTheDay as any as jest.Mock).mockResolvedValue(word);

    const res = await resolver.wordOfTheDay();

    expect(res).toBe(word);
    expect((wordsService.getWordOfTheDay as any as jest.Mock)).toHaveBeenCalled();
  });
});
