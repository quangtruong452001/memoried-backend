import {
  IsString,
  IsUUID,
  Length,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';

export enum BlogType {
  TEAM = 'team',
  PROJECT = 'project',
  COMPANY = 'company',
}

export class BlogDto {
  @IsString()
  @Length(5, 100)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(BlogType)
  type: BlogType;

  @IsString()
  @Length(5, 155)
  description: string;

  @IsString()
  thumbnail: string;

  @IsUUID()
  author: string;

  @ValidateIf((o) => o.type === BlogType.PROJECT || o.type === BlogType.TEAM)
  @IsNotEmpty()
  @IsUUID()
  topic_id: string;
}
export class CreateBlogDto {
  title: string;

  type: BlogType;

  description: string;

  topic_id: string;
}
