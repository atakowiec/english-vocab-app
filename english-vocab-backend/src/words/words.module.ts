import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsResolver } from './words.resolver';
import WordEntity from './word.entity';
import { WordReport } from './word-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity, WordReport])],
  providers: [WordsService, WordsResolver],
  exports: [WordsService],
})
export class WordsModule {}
