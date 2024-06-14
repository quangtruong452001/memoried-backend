import { Injectable } from '@nestjs/common';
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

  async createNote(noteDto: NoteDto, current_user_id: string): Promise<Note> {
    const note = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.user', 'user')
      .where('section.id = :sectionId , user.id = :userId', {
        userId: noteDto.user_id,
        sectionId: noteDto.section_id,
      })
      .getOne();

    if (!note) {
      const newNote = new Note(note);
      newNote.createdBy = current_user_id;
      newNote.updatedBy = current_user_id;
      return await this.noteRepository.save(newNote);
    }
    note.isDeleted = true;
    note.updatedBy = current_user_id;
    note.createdBy = current_user_id;
    return await this.noteRepository.save(note);
  }

  async getNotesBySectionId(user_id: string): Promise<Note[]> {
    const notes = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.user', 'user')
      .where('section.id = :sectionId', {
        userId: user_id,
        isDeleted: false,
      })
      .getMany();

    return notes;
  }

  async deleteNote(noteDto: NoteDto) {
    const note = await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.user', 'user')
      .where('section.id = :sectionId , user.id = :userId', {
        userId: noteDto.user_id,
        sectionId: noteDto.section_id,
      })
      .getOne();
    if (!note) {
      throw new Error('Image not found');
    }
    note.isDeleted = true;
    return await this.noteRepository.save(note);
  }
}