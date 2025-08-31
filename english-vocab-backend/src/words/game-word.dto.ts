import { Field, ObjectType } from '@nestjs/graphql';
import WordEntity from './word.entity';
import WordLearnStatus from './word-learn-status';

/**
 * A GraphQL object type representing a game word, including all the data needed for the frontend
 * like all the word information, similar words for test mode, etc.
 */
@ObjectType()
export default class GameWord {
  @Field(() => WordEntity)
  word: WordEntity;

  @Field(() => WordLearnStatus, { nullable: true })
  wordLearnStatus?: WordLearnStatus;

  @Field(() => [String])
  similarEnWords: string[];

  @Field(() => [String])
  similarPlWords: string[];
}
