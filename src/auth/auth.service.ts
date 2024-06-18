import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserOptionalDto } from 'src/database/dto/user.dto';
import { AuthDto } from 'src/database/dto';

// default avatar

const defaultAvatar =
  'data:image/png;base64,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';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async signUp(user: AuthDto, avatar?: string) {
    // Check if the username already used
    const existingUser = await this.userService.getUserByUsername(
      user.username,
    );

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await argon.hash(user.password);

    // Create a new user
    const newUser: UserOptionalDto = await this.userService.createUser({
      username: user.username,
      password: hashedPassword,
      avatar: avatar ? avatar : defaultAvatar,
    });

    // Create a new token
    // const tokens = await this.getToken(newUser.id, newUser.username);

    // Update the refresh token hash
    // await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
    // return tokens;

    return newUser;
  }

  async signIn(user: AuthDto) {
    // Check if the user exists
    const existingUser = await this.userService.getUserByUsername(
      user.username,
    );

    if (!existingUser) {
      throw new BadRequestException('User not registered');
    }

    // Check if the password is correct
    const pwMatched = await argon.verify(existingUser.password, user.password);

    // If the password is incorrect throw an error
    if (!pwMatched) {
      throw new ForbiddenException('Incorrect password');
    }

    // Create a new token

    const tokens = await this.getToken(existingUser.id, existingUser.username);

    // Update the refresh token hash
    await this.updateRefreshTokenHash(existingUser.id, tokens.refreshToken);
    return tokens;
  }

  async logOut(accessToken: string) {
    try {
      const decodedToken = this.jwtService.verify(accessToken); // Verify and decode the JWT
      const userId = decodedToken.user_id;

      // Check if token has expired
      // if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
      //   throw new Error('Token has expired');
      // }

      // Update the refreshTokenHashed field in the database
      const logoutUser = await this.userService.updateUser(userId, {
        refreshTokenHashed: '',
      });

      if (logoutUser) {
        return logoutUser;
      } else {
        throw new Error('User not found or unable to update');
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
      throw new Error('Invalid token or unable to log out');
    }
  }

  async handleRefreshToken(userId: string, refreshToken: string) {
    // Check if the user exists
    const existingUser = await this.userService.getUserById(userId);

    if (!existingUser) {
      throw new BadRequestException('User not registered');
    }

    // Check if the refresh token is correct
    const rtMatched = await argon.verify(
      existingUser.refreshTokenHashed,
      refreshToken,
    );

    // If the refresh token is incorrect throw an error
    if (!rtMatched) {
      throw new ForbiddenException('Incorrect refresh token');
    }

    // Create a new token
    const tokens = await this.getToken(existingUser.id, existingUser.username);

    // Update the refresh token hash
    await this.updateRefreshTokenHash(existingUser.id, tokens.refreshToken);

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
        expiresIn: '1d',
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
