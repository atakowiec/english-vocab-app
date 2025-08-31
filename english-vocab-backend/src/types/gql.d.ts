// src/types/graphql-context.ts
import { Request, Response } from 'express';
import { User } from '../user/user.entity';

export interface GraphQLContext {
  req: Request & { user?: User };
  res: Response;
}
