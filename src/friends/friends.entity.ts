import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity({name: "friends"})
export class FriendsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.friends)
  user: User;

  @ManyToOne(() => User, user => user.friendOf)
  friend: User;

}