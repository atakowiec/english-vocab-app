import { Field, ObjectType } from '@nestjs/graphql';
import ModeProgressDto from '../../learn-status/dto/mode-progress.dto';
import ExpDataDto from './exp-data.dto';

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

  @Field()
  lastPlayedMode: LearnMode

  @Field(() => ExpDataDto)
  expData: ExpDataDto;

  @Field(() => ModeProgressDto)
  speedModeProgress: ModeProgressDto;
}
