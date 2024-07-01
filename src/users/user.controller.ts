import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import { User } from "./user.entity";

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiOperation({ summary: 'Find user by username' })
  @ApiResponse({ status: 200, description: 'User found.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findByUsername(@Query('username') username: string) {
    return await this.userService.findByUsername(username);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiResponse({ status: 200, description: 'User found.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Put()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated.', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(@Body() user: UpdateUserDto, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user['id'];
    return await this.userService.update(+userId, user);
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async remove(@Req() req: Request) {
    // @ts-ignore
    const userId = req.user['id'];
    return await this.userService.remove(+userId);
  }
}
