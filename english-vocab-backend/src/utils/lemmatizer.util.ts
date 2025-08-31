import * as lemmatizer from 'wink-lemmatizer';

export type LemmatizerType = 'verb' | 'noun' | 'adjective';

export function lemmatize(word: string, type: LemmatizerType): string {
  return lemmatizer[type](word);
}
