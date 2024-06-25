import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  password: string;
}

export class JwtPayload {
  username: string;
  user_id: string;
}

export class JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
