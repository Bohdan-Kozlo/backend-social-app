import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('TYPE_DATA_BASE'),
        host: configService.get<string>('HOST_DATA_BASE'),
        port: +configService.get<number>('PORT_DATA_BASE'),
        username: configService.get<string>('USER_NAME_DATA_BASE'),
        password: configService.get<string>('PASSWORD_DATA_BASE'),
        database: configService.get<string>('NAME_DATA_BASE'),
        entities: [],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PostsModule,
    LikesModule,
    CommentsModule,
    AuthModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
