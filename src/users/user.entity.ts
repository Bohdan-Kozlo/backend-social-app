import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "../posts/post.entity";
import { Comment } from "../comments/comment.entity";
import { Exclude } from "class-transformer";
import { Like } from "../likes/like.entity";
import { FriendsEntity } from "../friends/friends.entity";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @Column({nullable: true})
  refreshToken: string

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => FriendsEntity, friends => friends.user)
  friends: FriendsEntity[];

  @OneToMany(() => FriendsEntity, friends => friends.friend)
  friendOf: FriendsEntity[];


  constructor(item: Partial<User>) {
    Object.assign(this, item);
  }
}
