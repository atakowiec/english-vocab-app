import { Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
