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
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/database/dto';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { convertImageToBase64 } from 'src/utils';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorators/public.decorator';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
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
  async logOut(@GetCurrentUserId() userId: string) {
    // Check user id
    if (!userId) {
      return 'User id is required';
    }

    const userLogout = await this.authService.logOut(userId);
    if (userLogout) {
      return {
        message: 'User logged out',
        // metadata: {
        //   userLogout,
        // },
      };
    }
  }

  @Post('refresh')
  async refreshToken() {
    return 'Refresh Token';
  }
}
