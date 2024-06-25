import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  password: string;

  @IsString()
  avatar?: string;
}

export class UserOptionalDto {
  id?: string;
  username?: string;
  password?: string;
  avatar?: string;
  refreshTokenHashed?: string;
}
