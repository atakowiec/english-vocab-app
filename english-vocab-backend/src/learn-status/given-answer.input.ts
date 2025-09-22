import { Field, InputType } from '@nestjs/graphql';
import { LearnMode } from './learn-mode';

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
