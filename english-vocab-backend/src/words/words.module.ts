import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Word from './word.entity';
import WordStatus from '../scrapper/word-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word, WordStatus])],
  providers: [WordsService],
  controllers: [WordsController],
  exports: [WordsService],
})
export class WordsModule {}
