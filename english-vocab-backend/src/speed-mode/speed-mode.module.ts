import { Module } from '@nestjs/common';
import { SpeedModeService } from './speed-mode.service';
import { SpeedModeResolver } from './speed-mode.resolver';
import { WordsModule } from '../words/words.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import WordEntity from '../words/word.entity';
import WordLearnStatus from '../words/word-learn-status';

@Module({
  imports: [WordsModule, TypeOrmModule.forFeature([WordEntity, WordLearnStatus])],
  providers: [SpeedModeService, SpeedModeResolver],
})
export class SpeedModeModule {}
