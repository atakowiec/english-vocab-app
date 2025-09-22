import { Module } from '@nestjs/common';
import { SpeedModeService } from './speed-mode.service';
import { SpeedModeResolver } from './speed-mode.resolver';
import { WordsModule } from '../words/words.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import WordEntity from '../words/word.entity';
import WordLearnEntry from '../learn-status/word-learn-entry.entity';
import { LearnStatusModule } from '../learn-status/learn-status.module';

@Module({
  imports: [WordsModule,
    LearnStatusModule,
    TypeOrmModule.forFeature([WordEntity, WordLearnEntry])],
  providers: [SpeedModeService, SpeedModeResolver],
})
export class SpeedModeModule {}
