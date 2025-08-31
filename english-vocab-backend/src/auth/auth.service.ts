import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from './dto/register.input';
import { UserService } from '../user/user.service';
import { AuthPayload } from './auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<boolean> {
    const conflictErrors: { name?: string; email?: string } = {};
    if (await this.usersRepo.findOne({ where: { email: input.email } })) {
      conflictErrors.email = 'Email already exists';
    }

    if (await this.usersRepo.findOne({ where: { name: input.name } })) {
      conflictErrors.name = 'Name already exists';
    }

    if (conflictErrors.email || conflictErrors.name) {
      throw new ConflictException(conflictErrors);
    }

    console.log('Registered user:', input.email, input.name, input.password);

    const hashed = await bcrypt.hash(input.password, 10);
    await this.usersRepo.save({ ...input, password: hashed });
    return true;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException({
      general: 'Invalid credentials',
    });
  }

  login(user: User): AuthPayload {
    const payload = { sub: user.id, email: user.email };

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
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    if (!this.jwtService.verify(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: { sub: number } = this.jwtService.decode(refreshToken);

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.login(user);
  }
}
