import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class LearningStatsDto {
  @Field()
  learnedToday: number;

  @Field()
  learnedThisWeek: number;

  @Field()
  learnedThisMonth: number;

  @Field()
  learnedThisYear: number;
}
