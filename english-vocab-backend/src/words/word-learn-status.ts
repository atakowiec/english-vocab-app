import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import WordEntity from './word.entity';
import { User } from '../user/user.entity';

/**
 * A class that represents the status of a word in the user's learning process.
 * It tracks how many times the user has answered correctly or incorrectly in certain modes,
 * and whether the word is currently marked as learned.
 */
@Entity()
@ObjectType()
export default class WordLearnEntry {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => WordEntity, (word) => word.learnStatuses, { eager: true })
  @JoinColumn({ name: 'wordId' })
  @Field(() => WordEntity)
  word: WordEntity;

  @ManyToOne(() => User, (user) => user.wordLearnEntries, { eager: true })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @Column({ default: false })
  @Field()
  learned: boolean;

  @Column({ default: 0 })
  @Field(() => Int)
  speedModeCorrectAnswers: number;

  @Column({ default: 0 })
  @Field(() => Int)
  speedModeWrongAnswers: number;
}
