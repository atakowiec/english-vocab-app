import { Query, Resolver } from '@nestjs/graphql';
import UserDataDto from '../user/dto/user-data.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/user.entity';
import { UserDataService } from './user-data.service';

@Resolver()
export class UserDataResolver {
  readonly logger = new Logger(UserDataResolver.name);
  constructor(private readonly userDataService: UserDataService) {
    // empty
  }

  @Query(() => UserDataDto)
  @UseGuards(GqlAuthGuard)
  async getUserData(@CurrentUser() user: User): Promise<UserDataDto> {
    this.logger.log(`Getting user data for user ${user.id}`);
    const userData = await this.userDataService.getUserData(user);
    this.logger.log(`Got user data for user ${user.id}`);
    this.logger.debug(JSON.stringify(userData));

    return userData;
  }
}
