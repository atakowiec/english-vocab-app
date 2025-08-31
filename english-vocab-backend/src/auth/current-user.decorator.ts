import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { GraphQLContext } from '../types/gql';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): User => {
  const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext();
  return ctx.req.user!;
});
