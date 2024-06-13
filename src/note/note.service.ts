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

  async getNotesBySectionId(user_Id: string): Promise<Note[]> {
    return await this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.user', 'user')
      .where('section.id = :sectionId', {
        userId: user_Id,
      })
      .getMany();
  }
}
