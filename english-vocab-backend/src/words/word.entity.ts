import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word_en: string;

  @Column()
  word_pl: string;

  @Column({ nullable: true })
  base_word_en?: string;

  @Column({ length: 1023, nullable: true })
  definition_en?: string;

  @Column({ nullable: true })
  type?: string;

  @Column()
  tags: string;

  @Column({ length: 1023 })
  examples: string;

  @Column()
  other_forms: string;
}
