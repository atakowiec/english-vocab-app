import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LearnStatusModule } from "../learn-status/learn-status.module";
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User]), LearnStatusModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
