import { IsString, Length, IsNotEmpty, IsUUID } from 'class-validator';

export class CommentDto {
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  comment: string;

  @IsUUID()
  @IsNotEmpty()
  blog: string;
}
