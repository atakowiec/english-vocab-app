import { Module } from '@nestjs/common';
import { LearnStatusService } from './learn-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import WordLearnEntry from './dto/word-learn-entry.entity';
import { SpeedModeResolver } from './learn-status.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([WordLearnEntry])],
  providers: [LearnStatusService, SpeedModeResolver],
  exports: [LearnStatusService],
})
export class LearnStatusModule {}
