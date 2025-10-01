import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GivenAnswerInput {
  @Field()
  word_id: number;

  @Field()
  correct: boolean;

  @Field()
  date: Date;

  @Field()
  learnMode: LearnMode;
}
