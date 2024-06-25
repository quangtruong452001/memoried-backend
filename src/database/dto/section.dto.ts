import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SectionDto {
  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsUUID()
  @IsNotEmpty()
  blog_id: string;
}
