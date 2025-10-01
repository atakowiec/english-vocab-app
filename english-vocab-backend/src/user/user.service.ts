import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
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
}
