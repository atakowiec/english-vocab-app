import { Test, TestingModule } from '@nestjs/testing';
import { LearnStatusService } from './learn-status.service';

describe('LearnStatusService', () => {
  let service: LearnStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearnStatusService],
    }).compile();

    service = module.get<LearnStatusService>(LearnStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
