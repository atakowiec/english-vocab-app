import { Field, ObjectType } from '@nestjs/graphql';
import WordEntity from './word.entity';
import WordLearnStatusDto from '../learn-status/word-learn-status.dto';

/**
 * A GraphQL object type representing a game word, including all the data needed for the frontend
 * like all the word information, similar words for test mode, etc.
 */
@ObjectType()
export default class GameWord {
  @Field(() => WordEntity)
  word: WordEntity;

  @Field(() => WordLearnStatusDto)
  wordLearnStatus: WordLearnStatusDto;

  @Field(() => [String])
  similarEnWords: string[];

  @Field(() => [String])
  similarPlWords: string[];
}
