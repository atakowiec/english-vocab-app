import { Field, ObjectType } from '@nestjs/graphql';
import WordEntity from './word.entity';
import WordLearnEntry from './word-learn-status';

/**
 * A GraphQL object type representing a game word, including all the data needed for the frontend
 * like all the word information, similar words for test mode, etc.
 */
@ObjectType()
export default class GameWord {
  @Field(() => WordEntity)
  word: WordEntity;

  @Field(() => WordLearnEntry, { nullable: true })
  wordLearnEntry?: WordLearnEntry;

  @Field(() => [String])
  similarEnWords: string[];

  @Field(() => [String])
  similarPlWords: string[];
}
