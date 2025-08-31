import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import WordLearnStatus from '../words/word-learn-status';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @OneToMany(() => WordLearnStatus, (status) => status.user)
  wordStatuses: WordLearnStatus[];
}
