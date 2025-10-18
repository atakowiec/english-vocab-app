import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const usersRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  } as unknown as JwtService;

  const userService = {
    findById: jest.fn(),
  } as unknown as UserService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: usersRepo },
        { provide: JwtService, useValue: jwtService },
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user, hashing the password and saving the user', async () => {
      const input = { email: 'test@example.com', name: 'tester', password: 'plain' } as any;
      (usersRepo.findOne as jest.Mock)
        .mockResolvedValueOnce(undefined) // email not exists
        .mockResolvedValueOnce(undefined); // name not exists
      // @ts-ignore
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as any);
      (usersRepo.save as jest.Mock).mockResolvedValue(undefined);

      const res = await service.register(input);

      expect(res).toBe(true);
      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
      expect(usersRepo.save).toHaveBeenCalledWith({ ...input, password: 'hashed' });
    });

    it('should throw ConflictException when email already exists', async () => {
      const input = { email: 'dupe@example.com', name: 'tester', password: 'x' } as any;
      (usersRepo.findOne as jest.Mock)
        .mockResolvedValueOnce({ id: 1 }) // email exists
        .mockResolvedValueOnce(undefined);

      await expect(service.register(input)).rejects.toBeInstanceOf(ConflictException);
      await service.register(input).catch((e) => {
        const resp = (e as ConflictException).getResponse() as any;
        expect(resp.email).toBe('Email already exists');
      });
    });

    it('should throw ConflictException when name already exists', async () => {
      const input = { email: 'new@example.com', name: 'taken', password: 'x' } as any;
      (usersRepo.findOne as jest.Mock)
        .mockResolvedValueOnce(undefined) // email ok
        .mockResolvedValueOnce({ id: 2 }); // name exists

      await expect(service.register(input)).rejects.toBeInstanceOf(ConflictException);
      await service.register(input).catch((e) => {
        const resp = (e as ConflictException).getResponse() as any;
        expect(resp.name).toBe('Name already exists');
      });
    });
  });

  describe('validateUser', () => {
    it('returns user when email exists and password matches', async () => {
      const user = { id: 1, email: 'ok@example.com', password: 'hashed' } as any;
      (usersRepo.findOne as jest.Mock).mockResolvedValue(user);
      // @ts-ignore
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const res = await service.validateUser('ok@example.com', 'secret');

      expect(res).toBe(user);
      expect(bcrypt.compare).toHaveBeenCalledWith('secret', 'hashed');
    });

    it('throws UnauthorizedException when user not found', async () => {
      (usersRepo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.validateUser('none@example.com', 'x')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws UnauthorizedException when password mismatch', async () => {
      const user = { id: 1, email: 'ok@example.com', password: 'hashed' } as any;
      (usersRepo.findOne as jest.Mock).mockResolvedValue(user);
      // @ts-ignore
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as any);

      await expect(service.validateUser('ok@example.com', 'bad')).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('returns tokens and user, calling JwtService.sign with expected payloads', async () => {
      const user = { id: 42, email: 'u@example.com' } as any;
      (jwtService.sign as any as jest.Mock)
        .mockReturnValueOnce('access')
        .mockReturnValueOnce('refresh');

      const payload = await service.login(user);

      expect(payload).toEqual({ accessToken: 'access', refreshToken: 'refresh', user });
      expect((jwtService.sign as any as jest.Mock)).toHaveBeenNthCalledWith(
        1,
        { sub: 42, email: 'u@example.com' },
        { expiresIn: '1h' },
      );
      expect((jwtService.sign as any as jest.Mock)).toHaveBeenNthCalledWith(
        2,
        { sub: 42, email: 'u@example.com' },
        { expiresIn: '28d' },
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('throws UnauthorizedException when token missing', async () => {
      await expect(service.verifyRefreshToken('')).rejects.toThrow(new UnauthorizedException('Refresh token is missing'));
    });

    it('throws UnauthorizedException when token invalid', async () => {
      (jwtService.verify as any as jest.Mock).mockReturnValue(false);

      await expect(service.verifyRefreshToken('bad.token')).rejects.toThrow(new UnauthorizedException('Invalid refresh token'));
    });

    it('throws UnauthorizedException when user not found', async () => {
      (jwtService.verify as any as jest.Mock).mockReturnValue(true);
      (jwtService.decode as any as jest.Mock).mockReturnValue({ sub: 99 });
      (userService.findById as any as jest.Mock).mockResolvedValue(undefined);

      await expect(service.verifyRefreshToken('good.token')).rejects.toThrow(new UnauthorizedException('User not found'));
    });

    it('returns payload from login when token valid and user exists', async () => {
      (jwtService.verify as any as jest.Mock).mockReturnValue(true);
      const user = { id: 5, email: 'x@y.z' } as any;
      (jwtService.decode as any as jest.Mock).mockReturnValue({ sub: 5 });
      (userService.findById as any as jest.Mock).mockResolvedValue(user);

      const expected = { accessToken: 'a', refreshToken: 'b', user } as any;
      const loginSpy = jest.spyOn(service, 'login').mockResolvedValue(expected);

      const res = await service.verifyRefreshToken('good.token');

      expect(res).toBe(expected);
      expect(loginSpy).toHaveBeenCalledWith(user);
    });
  });
});
