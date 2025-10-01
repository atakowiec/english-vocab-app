import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class WordLearnStatusDto {
  @Field()
  allAnsweres: number;

  @Field()
  correctAnswers: number;

  @Field()
  incorrectAnswers: number;
}
