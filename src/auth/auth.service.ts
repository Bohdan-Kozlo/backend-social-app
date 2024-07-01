import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";
import { AuthDto } from "./dto/auth.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(createUserDto: CreateUserDto) {
    const userExist = await this.usersService.findByEmail(createUserDto.email)
    if (userExist) throw new BadRequestException("Credentials invalid")

    const passwordHash = await bcrypt.hash(createUserDto.password, 8)
    const newUser = await this.usersService.save({
      ...createUserDto,
      password: passwordHash
    })
    const tokens = await this.getTokens(newUser.id, newUser.email)
    await this.updateRefreshToken(newUser.id, tokens.refreshToken)
    return tokens
  }

  async login(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email)
    if (!user) throw new BadRequestException("Credentials invalid")

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) throw new BadRequestException("Credentials invalid")

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }
  
  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null)
    return await this.usersService.logout(userId)
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    const user = await this.usersService.findById(userId)
    if (!user) {
      throw new BadRequestException('User not found')
    }
    const passwordMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password)
    if (!passwordMatch) {
      throw new BadRequestException('Old password is incorrect')
    }
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 8)
    await this.usersService.save(user)
  }



  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 8)
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken)
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

}
