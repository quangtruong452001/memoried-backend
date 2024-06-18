import { IsUUID, IsNotEmpty } from 'class-validator';
export class NoteDto {
  @IsUUID()
  @IsNotEmpty()
  section_id: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
