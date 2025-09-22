import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import WordLearnEntry from '../learn-status/word-learn-entry.entity';

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

  @Column('json')
  @Field(() => [String])
  tags: string[] = [];

  @Column('json')
  @Field(() => [String])
  examples: string[] = [];

  @Column('json')
  @Field(() => [String])
  other_forms: string[] = [];

  @OneToMany(() => WordLearnEntry, (status) => status.word)
  learnStatuses: WordLearnEntry[];
}
