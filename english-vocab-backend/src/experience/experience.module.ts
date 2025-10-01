import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ExperienceService],
  exports: [ExperienceService], 
}) 
export class ExperienceModule {}
