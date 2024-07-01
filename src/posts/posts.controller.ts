import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './post.entity';
import { AccessTokenGuard } from "../common/guards/accessToken.guard";

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.', type: [PostEntity] })
  @UseGuards(AccessTokenGuard)
  @Get()
  async getAll(): Promise<PostEntity[]> {
    return await this.postsService.getAll();
  }

  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Return post by ID.', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getById(@Param('id') id: number): Promise<PostEntity> {
    return await this.postsService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created.', type: PostEntity })
  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request
  ): Promise<PostEntity> {
    // @ts-ignore
    const userId = req.user['sub'];
    return await this.postsService.create(createPostDto, +userId);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully updated.', type: PostEntity })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return await this.postsService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 204, description: 'The post has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
    // @ts-ignore
    const userId = req.user['sub'];
    await this.postsService.remove(id, +userId);
  }

  @ApiOperation({ summary: 'Get friends posts' })
  @ApiResponse({ status: 200, description: 'Return friends posts.', type: [CreatePostDto] })
  @UseGuards(AccessTokenGuard)
  @Get('friends')
  async getFriendsPosts(@Req() req: Request): Promise<PostEntity[]> {
    // @ts-ignore
    const userId = req.user['sub'];
    return await this.postsService.getFriendsPosts(+userId);
  }
}
