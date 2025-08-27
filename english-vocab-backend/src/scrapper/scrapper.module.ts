import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Word from '../words/word.entity';
import WordStatus from './word-status.entity';
import { WordsModule } from '../words/words.module';

@Module({
  imports: [TypeOrmModule.forFeature([Word, WordStatus]), WordsModule],
  providers: [ScrapperService],
  controllers: [ScrapperController],
})
export class ScrapperModule {}
