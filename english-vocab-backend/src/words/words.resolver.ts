import { Query, Resolver } from '@nestjs/graphql';
import WordEntity from './word.entity';
import { WordsService } from './words.service';

@Resolver()
export class WordsResolver {
  constructor(private readonly wordsService: WordsService) {
    // empty
  }

  @Query(() => WordEntity)
  async wordOfTheDay(): Promise<WordEntity> {
    return await this.wordsService.getWordOfTheDay();
  }
}
