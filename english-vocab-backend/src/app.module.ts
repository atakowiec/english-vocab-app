import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { ApolloDriver } from '@nestjs/apollo';
import { ScrapperModule } from './scrapper/scrapper.module';
import { WordsModule } from './words/words.module';
import { SpeedModeModule } from './speed-mode/speed-mode.module';
import WordStatus from './scrapper/word-status.entity';
import WordEntity from './words/word.entity';
import WordLearnEntry from './words/word-learn-status';
import { ConfigModule } from '@nestjs/config';

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
      entities: [User, WordStatus, WordEntity, WordLearnEntry],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ScrapperModule,
    WordsModule,
    SpeedModeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
