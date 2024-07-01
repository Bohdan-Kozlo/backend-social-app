import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Max, Min } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  profilePicture?: string;

  @ApiProperty()
  bio: string;
}
