import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredError } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('AT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since epoch
    if (payload.exp && payload.exp < currentTime) {
      throw new TokenExpiredError('Access Token expired', payload.exp);
    }

    return {
      ...payload,
    };
  }
}
