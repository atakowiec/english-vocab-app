import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import WordEntity from '../words/word.entity';
import { User } from '../user/user.entity';

/**
 * A class that represents a single entry in user's learning.
 * It literally represents a single given answer.
 * Contains e.g. a word, a date and the game mode that the user was playing
 */
@Entity()
export default class WordLearnEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WordEntity, (word) => word.learnStatuses, { eager: true })
  @JoinColumn({ name: 'wordId' })
  word: WordEntity;

  @ManyToOne(() => User, (user) => user.wordLearnEntries, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  correct: boolean;

  @Column()
  date: Date;

  @Column()
  mode: string;
}
