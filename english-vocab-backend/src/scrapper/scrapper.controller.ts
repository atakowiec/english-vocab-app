import { Controller, Param, Post, Logger } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import WordEntity from '../words/word.entity';

@Controller('scrapper')
export class ScrapperController {
  private readonly logger = new Logger(ScrapperController.name);

  constructor(private readonly scrapperService: ScrapperService) {
    // empty
  }

  @Post('load-default')
  public async loadDefault() {
    this.logger.log('POST /scrapper/load-default - loading default words');
    await this.scrapperService.loadDefaultWords();
    this.logger.log('Default words loaded');
  }

  @Post('fetch-next/:number')
  public async fetchNext(@Param('number') number: number) {
    this.logger.log(`POST /scrapper/fetch-next/${number} - fetching next words`);
    const words: WordEntity[] = [];
    for (let i = 0; i < number; i++) {
      const fetched: WordEntity[] | null = await this.scrapperService.fetchNextWord();

      if (fetched) {
        words.push(...fetched);
      }
    }
    this.logger.log(`Fetched total words: ${words.length}`);
    return { words };
  }

  @Post('scrape/:word')
  public async scrape(@Param('word') word: string) {
    this.logger.log(`POST /scrapper/scrape/${word}`);
    const result = await this.scrapperService.scrapeWord(word);
    this.logger.debug(`Scrape result for ${word}: urlWord=${result.urlWord}, toFetch=${result.toFetch?.length ?? 0}, words=${result.words?.length ?? 0}`);
    return result;
  }

  @Post('update-other-forms')
  public async save() {
    this.logger.log('POST /scrapper/update-other-forms - starting update');
    await this.scrapperService.updateOtherFormsForAllWords();
    this.logger.log('Finished updating other forms for all words');
  }
}
