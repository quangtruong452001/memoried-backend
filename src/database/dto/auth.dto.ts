export class AuthDto {
  username: string;
  password: string;
}

export class JwtPayload {
  username: string;
  user_id: string;
}

export class JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
