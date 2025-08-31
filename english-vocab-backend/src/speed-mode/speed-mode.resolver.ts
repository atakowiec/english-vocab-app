import { Query, Resolver } from '@nestjs/graphql';
import { SpeedModeService } from './speed-mode.service';
import GameWord from '../words/game-word.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';

@Resolver()
export class SpeedModeResolver {
  constructor(private readonly speedModeService: SpeedModeService) {
    // empty
  }

  @Query(() => [GameWord])
  @UseGuards(GqlAuthGuard)
  async getNextWords(@CurrentUser() user: User): Promise<GameWord[]> {
    return await this.speedModeService.getNextWords(user);
  }
}
