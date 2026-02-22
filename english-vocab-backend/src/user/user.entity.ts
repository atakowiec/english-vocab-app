import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import LearningSession from '../learn-status/entity/learning-session.entity';

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

  @OneToMany(() => LearningSession, (session) => session.user)
  sessions: LearningSession[];

  @Column()
  exp: number;
}
