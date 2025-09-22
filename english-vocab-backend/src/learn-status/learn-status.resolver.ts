import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { GivenAnswerInput } from './given-answer.input';
import { LearnStatusService } from './learn-status.service';

@Resolver()
export class SpeedModeResolver {
  constructor(private readonly learnStatusService: LearnStatusService) {
    // empty
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async saveAnswers(
    @CurrentUser() user: User,
    @Args({ name: 'input', type: () => [GivenAnswerInput] }) answers: GivenAnswerInput[],
  ): Promise<boolean> {
    await this.learnStatusService.saveAnswers(user, answers);
    return true;
  }
}
