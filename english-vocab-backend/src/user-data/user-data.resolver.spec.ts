import { Test, TestingModule } from '@nestjs/testing';
import { UserDataResolver } from './user-data.resolver';

describe('UserDataResolver', () => {
  let resolver: UserDataResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDataResolver],
    }).compile();

    resolver = module.get<UserDataResolver>(UserDataResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
