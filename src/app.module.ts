import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import entities from './database/entities';
import { ImagesModule } from './images/images.module';
import { SectionModule } from './section/section.module';
import { BlogModule } from './blog/blog.module';
import { NoteModule } from './note/note.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard';
import { TopicModule } from './topic/topic.module';
import { UserTopicModule } from './user-topic/user-topic.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      entities: entities,
      //synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UserModule,
    AuthModule,
    ImagesModule,
    SectionModule,
    BlogModule,
    NoteModule,
    TopicModule,
    UserTopicModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
