import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import WordLearnEntry from '../words/word-learn-status';

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

  @OneToMany(() => WordLearnEntry, (status) => status.user)
  wordLearnEntries: WordLearnEntry[];
}
