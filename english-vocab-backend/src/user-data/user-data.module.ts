import { Module } from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserDataResolver } from './user-data.resolver';
import WordLearnEntry from '../learn-status/dto/word-learn-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WordLearnEntry])],
  providers: [UserDataService, UserDataResolver],
  exports: [UserDataService],
}) 
export class UserDataModule {}
