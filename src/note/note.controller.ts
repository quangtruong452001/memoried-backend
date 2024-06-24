import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteDto } from 'src/database/dto/note.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { Created, SuccessResponse } from 'src/core/success.response';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async createNote(
    @Body('section_id') section_id: string,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return new Created({
      message: 'Note created successfully',
      metadata: await this.noteService.createNote(section_id, current_user_id),
    });
  }

  // @Get()
  // getNoteByUserId(@Query('user_id') user_id: string) {
  //   return this.noteService.getNotesBySectionId(user_id);
  // }

  @Get()
  async getNotesOfUser(
    @GetCurrentUserId() user_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (!user_id) {
      throw new ForbiddenException('User not logged in');
    }
    return new SuccessResponse({
      message: 'Notes fetched successfully',
      metadata: await this.noteService.getNotesOfUser(user_id, page, limit),
    });
  }

  @Patch('delete')
  async deleteImage(
    @GetCurrentUserId() user_id: string,
    @Query('section_id') section_id: string,
  ) {
    const tmp: NoteDto = { user_id, section_id };
    return new SuccessResponse({
      message: 'Note deleted successfully',
      metadata: await this.noteService.deleteNote(tmp),
    });
  }
}
