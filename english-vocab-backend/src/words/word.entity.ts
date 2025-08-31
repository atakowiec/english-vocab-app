import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import WordLearnStatus from './word-learn-status';

@Entity({ name: 'word' })
@ObjectType()
export default class WordEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  word_en: string;

  @Column()
  @Field()
  word_pl: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  base_word_en?: string;

  @Column({ length: 1023, nullable: true })
  @Field({ nullable: true })
  definition_en?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  type?: string;

  @Column()
  @Field()
  tags: string;

  @Column({ length: 1023 })
  @Field()
  examples: string;

  @Column()
  @Field()
  other_forms: string;

  @OneToMany(() => WordLearnStatus, (status) => status.word)
  learnStatuses: WordLearnStatus[];
}
