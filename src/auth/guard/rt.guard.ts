import { AuthGuard } from '@nestjs/passport';

// ** 'refresh-token' is a string that AuthGuard() will find the corresponding PassportStrategy in jwt.strategy.ts
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  constructor() {
    super();
  }
}
