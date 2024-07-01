import { Controller, Post, Delete, Get, Body, Req, UseGuards, Param } from "@nestjs/common";
import { FriendsService } from './friends.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('friends')
@ApiBearerAuth()
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({ summary: 'Add a friend' })
  @ApiResponse({ status: 201, description: 'Friend added successfully.' })
  @ApiResponse({ status: 404, description: 'User or friend not found.' })
  @ApiBody({ schema: { example: { friendId: 2 } } })
  async addFriend(@Body('friendId') friendId: number, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user['sub'];
    return await this.friendsService.addFriend(+userId, +friendId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':friendId')
  @ApiOperation({ summary: 'Remove a friend' })
  @ApiResponse({ status: 200, description: 'Friend removed successfully.' })
  @ApiResponse({ status: 404, description: 'Friendship not found.' })
  @ApiParam({ name: 'friendId', type: 'number', description: 'ID of the friend to remove' })
  async removeFriend(@Param('friendId') friendId: number, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user['sub'];
    await this.friendsService.removeFriend(+userId, +friendId);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiOperation({ summary: 'Get list of friends' })
  @ApiResponse({ status: 200, description: 'List of friends retrieved successfully.' })
  async getFriends(@Req() req: Request) {
    // @ts-ignore
    const userId = req.user['sub'];
    return await this.friendsService.getFriends(+userId);
  }
}
