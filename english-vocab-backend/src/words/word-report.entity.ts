import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import WordEntity from './word.entity';
import { User } from '../user/user.entity';

@ObjectType()
@Entity({ name: 'word_report' })
export class WordReport {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @ManyToOne(() => WordEntity, { nullable: false, onDelete: 'CASCADE' })
  @Field(() => WordEntity)
  word: WordEntity;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Field()
  @Column()
  reason: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
