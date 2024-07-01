import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "./like.entity";
import { Repository } from "typeorm";
import { PostsService } from "../posts/posts.service";
import { Post } from "../posts/post.entity";
import { User } from "../users/user.entity";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private likesRepository: Repository<Like>,
    private postService: PostsService
  ) {}

  async likePost(postId: number,  userId: number) {
    const post = await this.postService.getById(postId)
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const existingLike = await this.likesRepository.findOne({ where: { post: { id: postId }, user: { id: userId } } });

    if (existingLike) {
      throw new BadRequestException('User has already liked this post');
    }

    const like = this.likesRepository.create({
      post: { id: postId } as Post,
      user: { id: userId } as User,
    });

    return this.likesRepository.save(like);
  }

  async unlikePost(postId: number, userId: number) {
    const post = await this.postService.getById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const like = await this.likesRepository.findOne({ where: { post: { id: postId }, user: { id: userId } } });


    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likesRepository.remove(like);
  }
}
