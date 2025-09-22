import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import WordEntity from './word.entity';
import WordStatus from '../scrapper/word-status.entity';
import WordLearnEntry from '../learn-status/word-learn-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity, WordStatus, WordLearnEntry])],
  providers: [WordsService],
  controllers: [WordsController],
  exports: [WordsService],
})
export class WordsModule {}
