import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GivenAnswerInput } from '../learn-status/dto/given-answer.input';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ExpDataDto from '../user/dto/exp-data.dto';
import ModeProgressDto from '../learn-status/dto/mode-progress.dto';
import WordLearnEntry from '../learn-status/dto/word-learn-entry.entity';
import UserDataDto from '../user/dto/user-data.dto';
import { differenceInCalendarDays } from 'date-fns';

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WordLearnEntry)
    private readonly learnEntryRepository: Repository<WordLearnEntry>,
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

    await this.userRepository.save(user);
  }

  async getUserData(user: User): Promise<UserDataDto> {
    return {
      userId: user.id,
      streak: await this.getUserStreak(user),
      speedModeProgress: await this.getUserProgress('SPEED_MODE', user),
      expData: this.getExpData(user.exp),
    };
  }

  async getUserStreak(user: User): Promise<number> {
    // 1. Fetch all distinct dates (only date, no time)
    const rawDates = await this.learnEntryRepository
      .createQueryBuilder('entry')
      .select('DATE(entry.date)', 'date') // convert timestamp → date
      .where('entry.userId = :userId', { userId: user.id })
      .orderBy('date', 'DESC')
      .getRawMany<{ date: string }>();

    const dates = rawDates.map((d) => new Date(d.date));
    if (dates.length === 0) return 0;

    // 2. Initialize
    let streak = 1;
    let prevDate = dates[0];
    const today = new Date();

    // 3. If no activity today, allow streak to end on yesterday
    if (differenceInCalendarDays(today, prevDate) > 1) {
      // last activity was before yesterday → no active streak
      return 0;
    }

    // 4. Count consecutive days
    for (let i = 1; i < dates.length; i++) {
      const diff = differenceInCalendarDays(prevDate, dates[i]);
      if (diff === 1) {
        streak++;
        prevDate = dates[i];
      } else if (diff > 1) {
        break; // gap -> streak ends
      }
    }

    return streak;
  }

  getExpData(exp: number): ExpDataDto {
    let level = 1;
    let requiredExp = 10;
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

  async getUserProgress(learnMode: LearnMode, user: User): Promise<ModeProgressDto> {
    const allAnswers = await this.learnEntryRepository.find({
      where: {
        user: { id: user.id },
        mode: learnMode,
      },
    });

    return {
      streak: await this.getStreak(learnMode, user),
      allAnswers: allAnswers.length,
      correctAnswers: allAnswers.filter((a) => a.correct).length,
    };
  }

  async getStreak(learnMode: LearnMode, user: User): Promise<number> {
    // Note: Do not limit selected columns when ordering by other fields.
    // TypeORM on MySQL may generate a DISTINCT subquery that expects id/date
    // to be present; selecting only 'correct' causes Unknown column errors.
    const entries = await this.learnEntryRepository.find({
      where: {
        user: { id: user.id },
        mode: learnMode,
      },
      order: {
        date: 'DESC',
      },
      // select: ['correct'], // removed to avoid MySQL DISTINCT alias issue
      take: 100,
    });

    let streak = 0;
    for (const entry of entries) {
      if (entry.correct) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
