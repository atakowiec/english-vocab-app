import { Test, TestingModule } from '@nestjs/testing';
import { UserDataResolver } from './user-data.resolver';
import { UserDataService } from './user-data.service';
import { User } from '../user/user.entity';

describe('UserDataResolver', () => {
  let resolver: UserDataResolver;
  const userDataService = {
    getUserData: jest.fn(),
  } as unknown as UserDataService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDataResolver,
        { provide: UserDataService, useValue: userDataService },
      ],
    }).compile();

    resolver = module.get<UserDataResolver>(UserDataResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('getUserData should delegate to service with current user and return result', async () => {
    const user: User = { id: 42 } as any;
    const payload = { userId: 42, streak: 3 } as any;
    (userDataService.getUserData as any as jest.Mock).mockResolvedValue(payload);

    const res = await resolver.getUserData(user);

    expect(res).toBe(payload);
    expect((userDataService.getUserData as any as jest.Mock)).toHaveBeenCalledWith(user);
  });
});
