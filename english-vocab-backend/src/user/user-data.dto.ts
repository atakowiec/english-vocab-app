import { Field, ObjectType } from '@nestjs/graphql';
import ModeProgressDto from '../learn-status/mode-progress.dto';

/**
 * A class that holds all the information about logged-in user
 * Like streaks, progress wtc
 */
@ObjectType()
export default class UserDataDto {
  @Field()
  streak: number;

  @Field()
  exp: number;

  @Field(() => ModeProgressDto)
  speedModeProgress: ModeProgressDto;

  // @Field(() => ModeProgressDto)
  // wordBuildingProgress: ModeProgressDto;
}
