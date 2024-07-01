import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";
import { Repository } from "typeorm";

@Injectable()
export class FriendsService {
  constructor(@InjectRepository(FriendsEntity) private friendsRepository: Repository<FriendsEntity>) {
  }

  async addFriend(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }
    const existingFriend = await this.friendsRepository.findOne({
      where: {user: {id: userId}, friend: {id: friendId}}
    })

    if (existingFriend) {
      throw new BadRequestException('You are already friends with this user');
    }

    const friend = this.friendsRepository.create({
      user: {id: userId},
      friend: {id: friendId}
    })
    return this.friendsRepository.save(friend)
  }

  async removeFriend(userId: number, friendId: number) {
    const friend = await this.friendsRepository.findOne({
      where: {user: {id: userId}, friend: {id: friendId}}
    })
    if (!friend) {
      throw new BadRequestException('You are not friends with this user');
    }
    return this.friendsRepository.remove(friend)
  }

  async getFriends(userId: number) {
     const friends = await this.friendsRepository.find({
      where: {user: {id: userId}},
      relations: ['friend']
    })

    return friends.map(friends => friends.friend)
  }
}
