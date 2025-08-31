import { Test, TestingModule } from '@nestjs/testing';
import { SpeedModeService } from './speed-mode.service';

describe('SpeedModeService', () => {
  let service: SpeedModeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeedModeService],
    }).compile();

    service = module.get<SpeedModeService>(SpeedModeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
