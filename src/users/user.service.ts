import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByUsername(username: string) {
    return await this.userRepository.findOneBy({username})
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({id})
  }

  async save(user: CreateUserDto) {
    const new_user = new User(user)
    return await this.userRepository.save(new_user)
  }

  async update(id: number, user: UpdateUserDto) {
    const updatedUser = await this.userRepository.findOneBy({id})
    updatedUser.username = user.username
    updatedUser.email = user.email
    updatedUser.profilePicture = user.profilePicture
    updatedUser.bio = user.bio
    return await this.userRepository.save(updatedUser)
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({id})
    return await this.userRepository.remove(user)
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({email})
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOneBy({id: userId})
    user.refreshToken = refreshToken
    return await this.userRepository.save(user)
  }

  async logout(userId: number) {
    const user = await this.userRepository.findOneBy({id: userId})
    user.refreshToken = null
    return await this.userRepository.save(user)
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({id})
  }

}