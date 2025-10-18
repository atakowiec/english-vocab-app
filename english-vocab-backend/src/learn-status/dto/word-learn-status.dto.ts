import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class WordLearnStatusDto {
  @Field()
  allAnswers: number;

  @Field()
  correctAnswers: number;

  @Field()
  incorrectAnswers: number;
}
