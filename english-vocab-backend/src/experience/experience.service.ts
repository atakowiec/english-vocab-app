import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GivenAnswerInput } from '../learn-status/dto/given-answer.input';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ExpDataDto from '../user/dto/exp-data.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // empty
  }

  @OnEvent('words.learned')
  async handleWordLearnedEvent(user: User, answers: GivenAnswerInput[]) {
    // for now we will give 1exp for every correct answer

    const correctAnswers = answers.filter((a) => a.correct).length;

    await this.giveExpToUser(user, correctAnswers);
  }

  async giveExpToUser(user: User, amount: number) {
    user = (await this.userRepository.findOne({ where: { id: user.id } }))!;

    user.exp += amount;
  }

  getLevel(exp: number): ExpDataDto {
    let level = 0;
    let requiredExp = 100;
    let currentExp = exp;

    while (currentExp >= requiredExp) {
      level++;
      currentExp -= requiredExp;
      requiredExp = Math.floor(requiredExp * 1.1);
    }

    return {
      level,
      currentExp,
      requiredExp,
    };
  }
}
