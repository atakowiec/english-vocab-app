import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Partial<Repository<User>>>;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findById should call repository and return user when found', async () => {
    const user: User = { id: 5, email: 'a@b.com', name: 'john', password: 'x', wordLearnEntries: [], exp: 0 } as User;
    (repository.findOne as jest.Mock).mockResolvedValue(user);

    const result = await service.findById(5);

    expect(repository.findOne).toHaveBeenCalledTimes(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(result).toBe(user);

    expect(Logger.prototype.debug).toHaveBeenCalledWith('Finding user by id=5');
    expect(Logger.prototype.debug).toHaveBeenCalledWith('Found user id=5');
  });

  it('findById should return null and log warn when user not found', async () => {
    (repository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await service.findById(1);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBeNull();

    expect(Logger.prototype.debug).toHaveBeenCalledWith('Finding user by id=1');
    expect(Logger.prototype.warn).toHaveBeenCalledWith('User not found id=1');
  });
});
