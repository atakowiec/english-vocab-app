import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { ApolloDriver } from '@nestjs/apollo';
import { ScrapperModule } from './scrapper/scrapper.module';
import { WordsModule } from './words/words.module';
import WordStatus from './scrapper/word-status.entity';
import Word from './words/word.entity';

@Module({
  imports: [
    GraphQLModule.forRoot({
      path: '/graphql',
      autoSchemaFile: 'src/schema.gql',
      driver: ApolloDriver,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3336,
      username: 'user',
      password: 'password',
      database: 'english_vocab_app',
      entities: [User, WordStatus, Word],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ScrapperModule,
    WordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
