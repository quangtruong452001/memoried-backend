import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/database/dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: AuthDto, @Res() res: Response) {
    if (!dto) {
      return 'Username and password are required.';
    }
    const { accessToken, refreshToken } = await this.authService.signUp(dto);
    res.cookie('Authentication', accessToken, { httpOnly: true });
    res.cookie('Refresh', refreshToken, { httpOnly: true });
    res.send({
      message: 'Sign Up Successful',
      accessToken,
      refreshToken,
    });
  }

  @Post('signin')
  async signIn(@Body() dto: AuthDto) {
    if (!dto) {
      return 'Username and password are required.';
    }
    // Check if the access token exists from the request
    // get form the header
    // const access =

    return this.authService.signIn(dto);
  }

  @Post('logout')
  async logOut() {
    return 'Sign Out';
  }

  @Post('refresh')
  async refreshToken() {
    return 'Refresh Token';
  }
}
