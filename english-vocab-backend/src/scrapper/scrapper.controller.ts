import { Controller, Param, Post } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import WordEntity from '../words/word.entity';

@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {
    // empty
  }

  @Post('load-default')
  public async loadDefault() {
    await this.scrapperService.loadDefaultWords();
  }

  @Post('fetch-next/:number')
  public async fetchNext(@Param('number') number: number) {
    const words: WordEntity[] = [];
    for (let i = 0; i < number; i++) {
      const fetched: WordEntity[] | null = await this.scrapperService.fetchNextWord();

      if (fetched) {
        words.push(...fetched);
      }
    }
    return { words };
  }

  @Post('scrape/:word')
  public async scrape(@Param('word') word: string) {
    return await this.scrapperService.scrapeWord(word);
  }
}
