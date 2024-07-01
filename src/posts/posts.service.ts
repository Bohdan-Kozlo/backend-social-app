import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Post } from "./post.entity";
import { In, Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { UserService } from "../users/user.service";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsService } from "../friends/friends.service";

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private userService: UserService,
    private friendService: FriendsService
  ) {}

  async getAll() {
    return await this.postsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['comments', 'likes', 'user'],
    })
  }

  async getById(id: number) {
    return await this.postsRepository.findOne({
      where: { id },
      relations: ['comments', 'likes', 'user'],
    })

  }

  async create(post: CreatePostDto, userId: number) {
    const user = await this.userService.findById(userId)
    if (!user) {
      throw new BadRequestException('User not found')
    }
    const newPost = await this.postsRepository.create(post)
    newPost.user = user
    return await this.postsRepository.save(newPost)
  }

  async update(id: number ,updatePostDto: UpdatePostDto) {
    await this.postsRepository.update(id, updatePostDto);
    return await this.getById(id);
  }

  async remove(id: number, userId: number) {
    const post = await this.getById(id);
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    if (post.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.postsRepository.remove(post);
  }

  async getFriendsPosts(userId: number) {
    const friends = await this.friendService.getFriends(userId)
    const friendsIds = friends.map(friend => friend.id)

    const friendsPosts = await this.postsRepository.find({
      where: {user: {id: In(friendsIds)}},
      order: {
        createdAt: 'DESC',
      },
      relations: ['comments', 'likes', 'user'],
    })

    return friendsPosts
  }
}
