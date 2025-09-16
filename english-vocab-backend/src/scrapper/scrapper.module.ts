import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import WordEntity from '../words/word.entity';
import WordStatus from './word-status.entity';
import { WordsModule } from '../words/words.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity, WordStatus]), WordsModule, ConfigModule],
  providers: [ScrapperService],
  controllers: [ScrapperController],
})
export class ScrapperModule {}
