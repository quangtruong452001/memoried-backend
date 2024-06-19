import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteDto } from 'src/database/dto/note.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  createNote(
    @Body('section_id') section_id: string,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.noteService.createNote(section_id, current_user_id);
  }

  @Get()
  getNoteByUserId(@Query('user_id') user_id: string) {
    return this.noteService.getNotesBySectionId(user_id);
  }

  @Patch('delete')
  deleteImage(@Body(new ValidationPipe({ transform: true })) noteDto: NoteDto) {
    return this.noteService.deleteNote(noteDto);
  }
}
