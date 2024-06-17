import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredError } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log('payload', payload);
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer ', '')
      .trim();

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since epoch
    if (payload.exp && payload.exp < currentTime) {
      throw new TokenExpiredError(
        'Refresh Token expired, please Login again',
        payload.exp,
      );
    }

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      refreshToken,
    };
  }
}
