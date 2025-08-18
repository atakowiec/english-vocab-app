import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpGqlExceptionFilter } from './exception/gql.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpGqlExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
