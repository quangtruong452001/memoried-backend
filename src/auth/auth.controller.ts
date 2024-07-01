import { GetCurrentUserInfo } from './../decorators/getCurrentUserInfo.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/database/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { convertImageToBase64 } from 'src/utils';
import { Public } from 'src/decorators/public.decorator';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { RefreshTokenGuard } from './guard';
import { Created, SuccessResponse } from 'src/core/success.response';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @UseInterceptors(FileInterceptor('avatar'))
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() dto: AuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let avatarBase64 = null;
    if (file) {
      avatarBase64 = convertImageToBase64(file);
    }
    return new Created({
      message: 'User created',
      metadata: await this.authService.signUp(dto, avatarBase64),
    });
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: AuthDto) {
    try {
      const { accessToken, refreshToken } = await this.authService.signIn(dto);
      return new SuccessResponse({
        message: 'User signed in',
        metadata: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@GetCurrentUserId() userId: string) {
    // Check user id
    if (!userId) {
      return new BadRequestException('User id is required');
    }

    const userLogout = await this.authService.logOut(userId);
    if (userLogout) {
      return new SuccessResponse({
        message: 'User logged out',
        metadata: {
          delRefreshToken: userLogout.refreshTokenHashed,
        },
      });
    } else {
      return new BadRequestException('User Logout failed');
    }
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUserInfo('refreshToken') refreshToken: string,
  ) {
    return new SuccessResponse({
      message: 'Refresh token success',
      metadata: await this.authService.handleRefreshToken(userId, refreshToken),
    });
  }
}
