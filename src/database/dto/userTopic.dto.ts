import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserTopicDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  topic_id: string;
}
