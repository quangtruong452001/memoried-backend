import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { CreateUserDto, UserOptionalDto } from 'src/database/dto/user.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async signUp(user: CreateUserDto) {
    // Check if the username already used
    const existingUser = await this.userService.getUserByUsername(
      user.username,
    );

    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash the password
    const hashedPassword = await argon.hash(user.password);

    // Create a new user
    const newUser: UserOptionalDto = await this.userService.createUser({
      username: user.username,
      password: hashedPassword,
      avatar: user.avatar ? user.avatar : null,
    });

    // Create a new token
    const tokens = await this.getToken(newUser.id, newUser.username);

    // Update the refresh token hash
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async getToken(user_id: string, username: string) {
    const payload = {
      user_id,
      username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('AT_SECRET'),
        expiresIn: '1h',
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshTokenHash(user_id: string, rt: string) {
    const hash = await argon.hash(rt);
    await this.userService.updateUser(user_id, { refreshTokenHashed: hash });
  }
}
