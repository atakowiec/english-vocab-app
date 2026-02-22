import { Field, InputType } from '@nestjs/graphql';
import { Language, LearningSubMode } from '../../app.types';

@InputType()
export class GivenAnswerInput {
  @Field()
  word_id: number;

  @Field()
  correct: boolean;

  @Field()
  date: Date;

  @Field()
  learnMode: LearningSubMode;

  @Field(() => [String])
  distractors: string[];

  @Field()
  language: Language
}
