import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from './comment.entity'; // Замість цього імпорту використайте ваші власні імпорти

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, description: 'Comment added successfully.', type: Comment })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async addComment(
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request
  ) {
    // @ts-ignore
    const userId = req.user['sub'];
    return await this.commentsService.addComment(createCommentDto, +postId, +userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiOperation({ summary: 'Get comments of a post' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved comments.', type: [Comment] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getComments(@Param('postId') postId: number) {
    return await this.commentsService.getCommentsByPostId(postId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  @ApiOperation({ summary: 'Remove a comment from a post' })
  @ApiResponse({ status: 200, description: 'Comment removed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You can only delete your own comments.' })
  async removeComment(
    @Param('commentId') commentId: number,
    @Req() req: Request
  ): Promise<void> {
    // @ts-ignore
    const userId = req.user['sub'];
    await this.commentsService.removeComment(commentId, +userId);
  }
}
