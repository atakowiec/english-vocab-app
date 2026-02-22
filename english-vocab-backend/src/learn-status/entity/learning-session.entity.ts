import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import LearnEntry from './learn-entry.entity';
import { LearningMode } from '../../app.types';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * A class that represents a single word in a single session of a learning mode.
 */
@Entity()
@ObjectType()
export default class LearningSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions, { eager: true })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @Column()
  @Field()
  mode: LearningMode;

  @Column()
  @Field()
  session_start: Date;

  @Column()
  active: boolean;

  @OneToMany(() => LearnEntry, (entry) => entry.word)
  learnEntries: LearnEntry[];
}