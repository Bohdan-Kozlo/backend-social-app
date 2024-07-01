import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private postsService: PostsService
  ) {}

  async addComment(comment: CreateCommentDto, postId: number, userId: number) {
    const post = await this.postsService.getById(postId)
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const newComment = await this.commentsRepository.create({
      content: comment.content,
      post,
      user: { id: userId }
    })
    return await this.commentsRepository.save(newComment)
  }

  async getCommentsByPostId(postId: number) {
    const post = await this.postsService.getById(postId)
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.commentsRepository.find({
      where: {post: {id: postId}},
      order: {createdAt: 'DESC'},
      relations: ['user', 'post'],
    })
  }

  async removeComment(commentId: number, userId: number) {
    const comment = await this.commentsRepository.findOne({where: {id: commentId, user: {id: userId}}})
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentsRepository.remove(comment)
  }
}
