import { Test, TestingModule } from '@nestjs/testing';
import { SpeedModeResolver } from './speed-mode.resolver';

describe('SpeedModeResolver', () => {
  let resolver: SpeedModeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeedModeResolver],
    }).compile();

    resolver = module.get<SpeedModeResolver>(SpeedModeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
