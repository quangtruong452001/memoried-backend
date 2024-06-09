import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/database/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** TODO: Update body type */
  @Post('signup')
  async signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  async signIn() {
    return 'Sign In';
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
