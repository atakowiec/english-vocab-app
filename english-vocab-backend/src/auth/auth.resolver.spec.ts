import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const authService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    verifyRefreshToken: jest.fn(),
  } as unknown as AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('hello should return greeting', () => {
    expect(resolver.hello()).toBe('Hello from GraphQL!');
  });

  it('register should call authService.register and return its result', async () => {
    const input = { email: 'a@b.c', name: 'n', password: 'p' } as any;
    (authService.register as any as jest.Mock).mockResolvedValue(true);

    const res = await resolver.register(input);

    expect(res).toBe(true);
    expect((authService.register as any as jest.Mock)).toHaveBeenCalledWith(input);
  });

  it('login should validate user then login and return payload', async () => {
    const input = { email: 'a@b.c', password: 'p' } as any;
    const user = { id: 1, email: input.email } as any;
    const payload = { accessToken: 'a', refreshToken: 'r', user } as any;
    (authService.validateUser as any as jest.Mock).mockResolvedValue(user);
    (authService.login as any as jest.Mock).mockResolvedValue(payload);

    const res = await resolver.login(input);

    expect(res).toBe(payload);
    expect((authService.validateUser as any as jest.Mock)).toHaveBeenCalledWith(input.email, input.password);
    expect((authService.login as any as jest.Mock)).toHaveBeenCalledWith(user);
  });

  it('refreshToken should delegate to authService.verifyRefreshToken', async () => {
    const payload = { accessToken: 'a', refreshToken: 'r', user: { id: 1 } } as any;
    (authService.verifyRefreshToken as any as jest.Mock).mockResolvedValue(payload);

    const res = await resolver.refreshToken('rtoken');

    expect(res).toBe(payload);
    expect((authService.verifyRefreshToken as any as jest.Mock)).toHaveBeenCalledWith('rtoken');
  });
});

