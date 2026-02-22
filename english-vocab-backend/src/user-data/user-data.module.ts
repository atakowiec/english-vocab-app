import { Module } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserDataResolver } from './user-data.resolver';
import LearnEntry from '../learn-status/entity/learn-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LearnEntry])],
  providers: [UserDataService, UserDataResolver],
  exports: [UserDataService],
}) 
export class UserDataModule {}
