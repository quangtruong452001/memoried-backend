import { IsNotEmpty, IsString, Length } from 'class-validator';
export class TopicDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  topic_name: string;
}
