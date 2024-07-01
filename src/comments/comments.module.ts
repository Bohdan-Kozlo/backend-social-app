import { Module } from '@nestjs/common';
import { Comment } from "./comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [],
})
export class CommentsModule {}
