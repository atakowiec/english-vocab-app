import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import UserDataDto from '../user/user-data.dto';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;

  @Field(() => UserDataDto)
  userData: UserDataDto;
}
