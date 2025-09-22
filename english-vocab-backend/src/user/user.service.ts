import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import UserDataDto from './user-data.dto';
import { LearnStatusService } from '../learn-status/learn-status.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly learnStatusService: LearnStatusService,
  ) {
    // empty
  }

  async findById(id: number): Promise<User | null> {
    this.logger.debug(`Finding user by id=${id}`);
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User not found id=${id}`);
    } else {
      this.logger.debug(`Found user id=${user.id}`);
    }
    return user;
  }

  async getUserData(user: User): Promise<UserDataDto> {
    return {
      exp: user.exp,
      streak: 0, // todo
      speedModeProgress: await this.learnStatusService.getUserProgress("SPEED_MODE", user),
    };
  }
}
