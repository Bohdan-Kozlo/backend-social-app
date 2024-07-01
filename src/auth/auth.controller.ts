import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChangePasswordDto } from "./dto/change-password.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('login')
  async login(@Body() data: AuthDto) {
    return await this.authService.login(data);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('logout')
  async logout(@Req() req: Request) {
    // @ts-ignore
    await this.authService.logout(+req.user['sub']);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Access token successfully refreshed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    // @ts-ignore
    const userId = req.user['sub'];
    // @ts-ignore
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens(+userId, refreshToken);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password successfully changed.' })
  @UseGuards(AccessTokenGuard)
  @Put('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: Request) {
    // @ts-ignore
    const userId = req.user['sub']
    return await this.authService.changePassword(changePasswordDto, +userId)
  }
}