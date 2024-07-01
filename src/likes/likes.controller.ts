import { Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common";
import { LikesService } from "./likes.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";

@ApiTags('likes')
@ApiBearerAuth()
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 201, description: 'Post liked successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 400, description: 'User has already liked this post.' })
  @UseGuards(AccessTokenGuard)
  @Post()
  async likePost(@Param('postId') postId: number, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user['sub'];
    return await this.likesService.likePost(postId, userId);
  }

  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 204, description: 'Like removed successfully.' })
  @ApiResponse({ status: 404, description: 'Post or Like not found.' })
  @UseGuards(AccessTokenGuard)
  @Delete()
  async unlikePost(@Param('postId') postId: number, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user['sub'];
    return await this.likesService.unlikePost(postId, userId);
  }
}