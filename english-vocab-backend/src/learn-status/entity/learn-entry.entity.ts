import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import WordEntity from '../../words/dto/word.entity';
import LearningSession from './learning-session.entity';
import { Language, LearningSubMode } from '../../app.types';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * A class that represents a single entry in a user's learning.
 * It literally represents a single given answer.
 * Contains e.g., a word, a date and the game mode that the user was playing
 */
@Entity()
@ObjectType()
export default class LearnEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LearningSession, (session) => session.learnEntries, { eager: true })
  @JoinColumn({ name: 'sessionId' })
  @Field(() => LearningSession)
  session: LearningSession;

  @ManyToOne(() => WordEntity, (word) => word.learnEntries, { eager: true })
  @JoinColumn({ name: 'wordId' })
  @Field(() => WordEntity)
  word: WordEntity;

  @Column()
  @Field(() => Boolean)
  correct: boolean;

  @Column()
  @Field()
  date: Date;

  @Column()
  @Field()
  mode: LearningSubMode;

  @Column('json')
  @Field(() => [String])
  distractors: string[] = [];

  @Column()
  @Field()
  language: Language
}
