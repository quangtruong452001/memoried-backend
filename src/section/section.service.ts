import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Section } from 'src/database/entities/section.entity';
import { SectionDTO } from 'src/database/dto/section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    private manager: EntityManager,
  ) {}

  async createSection(section: SectionDTO) {
    const newSection = new Section(section);

    return await this.manager.save(newSection);
  }

  async getSectionById(section_id: string) {
    return await this.sectionRepository.findOne({ where: { id: section_id } });
  }

  async getSectionsByBlogId(blog_id: string) {
    const sections = await this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.blog', 'blog')
      .where('blog.id = :blogId', {
        blogId: blog_id,
      })
      .getMany();

    return sections;
  }

  async updateSection(section_id: string, section: Section) {
    let sectionToUpdate = await this.sectionRepository.findOne({
      where: {
        id: section_id,
      },
    });
    sectionToUpdate = { ...sectionToUpdate, ...section };
    return await this.manager.save(sectionToUpdate);
  }

  async deleteSection(section_id: string) {
    const section = await this.sectionRepository.findOne({
      where: {
        id: section_id,
      },
    });
    if (!section) {
      throw new Error('Image not found');
    }
    section.isDeleted = true;
    return await this.manager.save(section);
  }
}
