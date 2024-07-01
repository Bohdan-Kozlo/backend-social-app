import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto {
  @ApiProperty()
  content: string

  @ApiProperty()
  imageUrl?: string
}