import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Like } from "./like.entity";
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [TypeOrmModule.forFeature([Like]), PostsModule],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
