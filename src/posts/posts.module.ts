import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from "../users/users.module";
import { FriendsModule } from "../friends/friends.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule, FriendsModule],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
