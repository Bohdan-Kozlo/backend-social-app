import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsEntity } from "./friends.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FriendsEntity])],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService]
})
export class FriendsModule {}
