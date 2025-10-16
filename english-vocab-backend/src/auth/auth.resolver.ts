import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './dto/auth-payload.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL!';
  }

  @Mutation(() => Boolean)
  async register(@Args('input') input: RegisterInput): Promise<boolean> {
    console.log('Registering user:', input.email, input.name, input.password);
    return await this.authService.register(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const user = await this.authService.validateUser(input.email, input.password);
    return await this.authService.login(user);
  }

  @Query(() => AuthPayload)
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<AuthPayload> {
    return this.authService.verifyRefreshToken(refreshToken);
  }
}
