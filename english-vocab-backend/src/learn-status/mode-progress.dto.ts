import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class ModeProgressDto {
  @Field()
  streak: number;

  @Field()
  correctAnswers: number;

  @Field()
  allAnswers: number;

  @Field()
  allWords: number;
}
