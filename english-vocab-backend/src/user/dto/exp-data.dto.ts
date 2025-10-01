import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class ExpDataDto {
  @Field()
  level: number;

  @Field()
  currentExp: number;

  @Field()
  requiredExp: number;
}
