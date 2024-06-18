import { IsUrl, IsNotEmpty, IsUUID } from 'class-validator';

export class ImageDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsUUID()
  section: string;
}
