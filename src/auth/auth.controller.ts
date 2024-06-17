import { GetCurrentUserInfo } from './../decorators/getCurrentUserInfo.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/database/dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { convertImageToBase64 } from 'src/utils';
import { Public } from 'src/decorators/public.decorator';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { RefreshTokenGuard } from './guard';
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
    @Res() res: Response,
  ) {
    if (!dto) {
      return 'Username and password are required.';
    }
    let avatarBase64 = null;
    if (file) {
      avatarBase64 = convertImageToBase64(file);
    }
    // const { accessToken, refreshToken } = await this.authService.signUp(
    //   dto,
    //   avatarBase64,
    // );
    // res.cookie('Authentication', accessToken, { httpOnly: true });
    // res.cookie('Refresh', refreshToken, { httpOnly: true });

    const newUser = await this.authService.signUp(dto, avatarBase64);
    if (newUser) {
      res.send({
        message: 'User created successfully',
      });
    }
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: AuthDto, @Res() res: Response) {
    if (!dto) {
      return 'Username and password are required.';
    }
    // Check if the access token exists from the request
    // get form the header
    // const access =

    const { accessToken, refreshToken } = await this.authService.signIn(dto);
    res.cookie('Authentication', accessToken, { httpOnly: true });
    res.cookie('Refresh', refreshToken, { httpOnly: true });

    res.send({
      message: 'User logged in',
      metadata: {
        accessToken,
        refreshToken,
      },
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@Headers('authorization') authHeader: string) {
    // Check user id
    if (!authHeader) {
      return { message: 'Authorization header is required' };
    }
    const accessToken = authHeader.split(' ')[1]; // Assuming the token is in the "Authorization" header as "Bearer TOKEN"
    if (!accessToken) {
      return { message: 'Access token is required' };
    }

    const userLogout = await this.authService.logOut(accessToken);
    if (userLogout) {
      return {
        message: 'User logged out',
        // metadata: {
        //   userLogout,
        // },
      };
    } else {
      return { message: 'Logout failed' };
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
    return await this.authService.handleRefreshToken(userId, refreshToken);
  }
}
