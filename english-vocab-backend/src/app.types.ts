import { registerEnumType } from '@nestjs/graphql';

export enum LearningMode {
  SPEED_TEST = 'SPEED_TEST',
  LEARNING = 'LEARNING',
}

export enum LearningSubMode {
  BUILDING = 'BUILDING',
  DEFINITION = 'DEFINITION',
  SPEED_TEST = 'SPEED_TEST',
}

export enum Language {
  EN = 'en',
  PL = 'pl',
}

registerEnumType(LearningMode, {
  name: 'LearningMode',
});

registerEnumType(LearningSubMode, {
  name: 'LearningSubMode',
});

registerEnumType(Language, {
  name: 'Language',
});
