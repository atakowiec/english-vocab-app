import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import UserDataDto from './dto/user-data.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './user.entity';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {
    // empty
  }

  @Query(() => UserDataDto)
  @UseGuards(GqlAuthGuard)
  async getUserData(@CurrentUser() user: User): Promise<UserDataDto> {
    return await this.userService.getUserData(user);
  }
}
