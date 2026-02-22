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
import WordEntity from './words/dto/word.entity';
import LearnEntry from './learn-status/entity/learn-entry.entity';
import { ConfigModule } from '@nestjs/config';
import { LearningModule } from './learn-status/learning.module';
import { UserDataModule } from './user-data/user-data.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WordReport } from './words/dto/word-report.entity';
import LearningSession from './learn-status/entity/learning-session.entity';

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
      entities: [User, WordStatus, WordEntity, LearnEntry, WordReport, LearningSession],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({ global: true }),
    UserModule,
    AuthModule,
    ScrapperModule,
    WordsModule,
    LearningModule,
    UserDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
