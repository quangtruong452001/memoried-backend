import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Note } from 'src/database/entities/note.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteDto } from 'src/database/dto/note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    private manager: EntityManager,
  ) {}

  async getNotesOfUser(user_id: string, page: number = 1, limit: number = 5) {
    try {
      const notes = await this.noteRepository
        .createQueryBuilder('note')
        .leftJoinAndSelect('note.section', 'section')
        .where('note.user_id = :userId and note.isDeleted = :isDeleted', {
          userId: user_id,
          isDeleted: false,
        })
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('note.createdAt', 'DESC')
        .getMany();

      return notes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createNote(section_id: string, current_user_id: string): Promise<Note> {
    try {
      const note = await this.noteRepository
        .createQueryBuilder('note')
        .leftJoinAndSelect('note.user', 'user')
        .leftJoinAndSelect('note.section', 'section')
        .where('section.id = :sectionId AND user.id = :userId', {
          userId: current_user_id,
          sectionId: section_id,
        })
        .getOne();

      if (!note) {
        const newNote = new Note(note);
        newNote.section_id = section_id;
        newNote.user_id = current_user_id;
        newNote.createdBy = current_user_id;
        newNote.updatedBy = current_user_id;
        return await this.noteRepository.save(newNote);
      }
      note.isDeleted = false;
      note.updatedBy = current_user_id;
      note.createdBy = current_user_id;
      return await this.noteRepository.save(note);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getNotesBySectionId(user_id: string): Promise<Note[]> {
    try {
      const notes = await this.noteRepository
        .createQueryBuilder('note')
        .leftJoinAndSelect('note.user', 'user')
        .where('section.id = :sectionId', {
          userId: user_id,
          isDeleted: false,
        })
        .getMany();

      return notes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteNote(noteDto: NoteDto) {
    try {
      const note = await this.noteRepository
        .createQueryBuilder('note')
        .where('user_id = :userId AND section_id = :sectionId', {
          userId: noteDto.user_id,
          sectionId: noteDto.section_id,
        })
        .getOne();
      if (!note) {
        throw new NotFoundException('Note not found');
      }
      note.isDeleted = true;
      return await this.noteRepository.save(note);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
