import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class HttpGqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    const response = exception.getResponse();
    const status = exception.getStatus();

    return new GraphQLError(exception.message, {
      extensions: {
        code: this.mapStatusToCode(status),
        status,
        errors: response,
      },
    });
  }

  private mapStatusToCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
