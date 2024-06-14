import { IsString, IsUUID, Length, IsNotEmpty } from 'class-validator';

export class BlogDto {
  @IsString()
  @Length(5, 100)
  @IsNotEmpty()
  title: string;

  @IsString()
  @Length(5, 20)
  type: string;

  @IsString()
  @Length(5, 155)
  description: string;

  @IsString()
  thumbnail: string;

  @IsUUID()
  author: string;

  @IsUUID()
  topic_id: string;
}
