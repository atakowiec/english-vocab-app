import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { GivenAnswerInput } from './dto/given-answer.input';
import { LearningService } from './learning.service';
import GameWord from '../words/dto/game-word.dto';
import { LearningMode } from '../app.types';

@Resolver()
@UseGuards(GqlAuthGuard)
export class LearningResolver {
  constructor(private readonly learningService: LearningService) {
    // empty
  }

  @Mutation(() => Boolean)
  async saveAnswers(
    @CurrentUser() user: User,
    @Args({ name: 'answers', type: () => [GivenAnswerInput] }) answers: GivenAnswerInput[],
  ): Promise<Boolean> {
    await this.learningService.saveAnswers(user, answers);
    return true;
  }

  @Mutation(() => Number)
  async endSession(@CurrentUser() user: User, @Args('sessionId') sessionId: number): Promise<number> {
    await this.learningService.endSession(user, sessionId);

    return sessionId;
  }

  @Mutation(() => [GameWord])
  async getWords(@Args('mode') mode: LearningMode, @CurrentUser() user: User): Promise<GameWord[]> {
    return await this.learningService.getWords(mode, user);
  }
}
