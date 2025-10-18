import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import WordEntity from './word.entity';
import { WordsService } from './words.service';
import GameWord from './game-word.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';

@Resolver()
export class WordsResolver {
  constructor(private readonly wordsService: WordsService) {
    // empty
  }

  @Query(() => WordEntity)
  async wordOfTheDay(): Promise<WordEntity> {
    return await this.wordsService.getWordOfTheDay();
  }

  @Query(() => [GameWord])
  @UseGuards(GqlAuthGuard)
  async getNextWords(@Args('mode') mode: LearnMode, @CurrentUser() user: User): Promise<GameWord[]> {
    return await this.wordsService.getNextWords(mode, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async saveWordReport(
    @Args('wordId') wordId: number,
    @Args('reason') reason: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.wordsService.saveWordReport(wordId, reason, user);

    return true;
  }
}
