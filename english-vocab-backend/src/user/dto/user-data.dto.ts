import { Field, ObjectType } from '@nestjs/graphql';
import ModeProgressDto from '../../learn-status/dto/mode-progress.dto';
import ExpDataDto from './exp-data.dto';
import LearningStatsDto from './learning-stats.dto';

/**
 * A class that holds all the information about logged-in user
 * Like streaks, progress wtc
 */
@ObjectType()
export default class UserDataDto {
  @Field()
  userId: number;

  @Field()
  streak: number;

  @Field(() => String, { nullable: true })
  lastPlayedMode: LearnMode | null;

  @Field(() => LearningStatsDto)
  learningStats: LearningStatsDto;

  @Field(() => ExpDataDto)
  expData: ExpDataDto;

  @Field(() => ModeProgressDto)
  speedModeProgress: ModeProgressDto;
}
