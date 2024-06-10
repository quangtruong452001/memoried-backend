export class CreateUserDto {
  username: string;
  password: string;
  avatar?: string;
}

export class UserOptionalDto {
  id?: string;
  username?: string;
  password?: string;
  avatar?: string;
  refreshTokenHashed?: string;
}
