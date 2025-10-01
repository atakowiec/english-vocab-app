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
import WordLearnEntry from './learn-status/dto/word-learn-entry.entity';
import { ConfigModule } from '@nestjs/config';
import { LearnStatusModule } from './learn-status/learn-status.module';
import { UserDataModule } from './user-data/user-data.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    EventEmitterModule.forRoot({ global: true }),
    UserModule,
    AuthModule,
    ScrapperModule,
    WordsModule,
    SpeedModeModule,
    LearnStatusModule,
    UserDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
