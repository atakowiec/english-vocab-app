import { ConflictException, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from './dto/register.input';
import { UserService } from '../user/user.service';
import { AuthPayload } from './dto/auth-payload.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<boolean> {
    this.logger.log(`Register attempt: email=${input.email}, name=${input.name}`);
    const conflictErrors: { name?: string; email?: string } = {};
    if (await this.usersRepo.findOne({ where: { email: input.email } })) {
      conflictErrors.email = 'Email already exists';
    }

    if (await this.usersRepo.findOne({ where: { name: input.name } })) {
      conflictErrors.name = 'Name already exists';
    }

    if (conflictErrors.email || conflictErrors.name) {
      this.logger.warn(`Registration conflict for email=${input.email}, name=${input.name}: ${JSON.stringify(conflictErrors)}`);
      throw new ConflictException(conflictErrors);
    }

    const hashed = await bcrypt.hash(input.password, 10);
    await this.usersRepo.save({ ...input, password: hashed });
    this.logger.log(`User registered: email=${input.email}, name=${input.name}`);
    return true;
  }

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.log(`Validating user with email=${email}`);
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.log(`User validated: id=${user.id}, email=${email}`);
      return user;
    }
    this.logger.warn(`Invalid credentials for email=${email}`);
    throw new UnauthorizedException({
      general: 'Invalid credentials',
    });
  }

  async login(user: User): Promise<AuthPayload> {
    const payload = { sub: user.id, email: user.email };
    this.logger.log(`Issuing tokens for user id=${user.id}`);

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '28d',
      }),
      user,
    };
  }

  async varifyRefreshToken(refreshToken: string): Promise<AuthPayload> {
    this.logger.log(`Verifying refresh token`);
    if (!refreshToken) {
      this.logger.warn('Refresh token is missing');
      throw new UnauthorizedException('Refresh token is missing');
    }

    if (!this.jwtService.verify(refreshToken)) {
      this.logger.warn('Invalid refresh token');
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: { sub: number } = this.jwtService.decode(refreshToken);

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      this.logger.warn(`Refresh token user not found: id=${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    return await this.login(user);
  }
}
