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

  // @Get()
  // getNoteByUserId(@Query('user_id') user_id: string) {
  //   return this.noteService.getNotesBySectionId(user_id);
  // }

  @Get()
  getNotesOfUser(
    @GetCurrentUserId() user_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (!user_id) {
      throw new Error('User not logged in');
    }
    return this.noteService.getNotesOfUser(user_id, page, limit);
  }

  @Patch('delete')
  deleteImage(
    @GetCurrentUserId() user_id: string,
    @Query('section_id') section_id: string,
  ) {
    const tmp: NoteDto = { user_id, section_id };
    return this.noteService.deleteNote(tmp);
  }
}
