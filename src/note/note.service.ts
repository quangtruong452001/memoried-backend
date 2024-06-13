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

  async createNote(noteDto: NoteDto): Promise<Note> {
    const newNote = this.noteRepository.create(noteDto);
    return await this.noteRepository.save(newNote);
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
    return await this.manager.save(note);
  }
}
