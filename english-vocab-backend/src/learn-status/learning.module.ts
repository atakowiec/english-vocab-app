import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import LearnEntry from './entity/learn-entry.entity';
import { LearningResolver } from './learning.resolver';
import LearningSession from './entity/learning-session.entity';
import { WordsModule } from '../words/words.module';

@Module({
  imports: [TypeOrmModule.forFeature([LearnEntry, LearningSession]), WordsModule],
  providers: [LearningService, LearningResolver],
  exports: [LearningService],
})
export class LearningModule {}
