import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class WordStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  word: string;

  @Column()
  fetched: boolean;
}
