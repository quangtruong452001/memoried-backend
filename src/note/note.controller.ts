import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteDto } from 'src/database/dto/note.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  createNote(@Body() note: NoteDto) {
    return this.noteService.createNote(note);
  }

  @Get()
  getNoteByUserId(@Query('user_id') user_id: string) {
    return this.noteService.getNotesBySectionId(user_id);
  }

  @Patch('delete')
  deleteImage(@Body() noteDto: NoteDto) {
    return this.noteService.deleteNote(noteDto);
  }
}
