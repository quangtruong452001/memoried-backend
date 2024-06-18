import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Section } from 'src/database/entities/section.entity';
import { SectionDto } from 'src/database/dto/section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    private manager: EntityManager,
  ) {}

  async createSection(section: SectionDto, current_user_id: string) {
    const newSection = new Section(section);
    newSection.createdBy = current_user_id;
    newSection.updatedBy = current_user_id;
    return await this.manager.save(newSection);
  }

  async getSectionById(section_id: string) {
    return await this.sectionRepository.findOne({
      where: { id: section_id, isDeleted: true },
    });
  }

  async getSectionsByBlogId(blog_id: string) {
    const sections = await this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.blog', 'blog')
      .where('blog.id = :blogId', {
        blogId: blog_id,
        isDeleted: false,
      })
      .orderBy('section.createdAt', 'ASC')
      .getMany();

    return sections;
  }

  async updateSection(
    section_id: string,
    section: SectionDto,
    current_user_id: string,
  ) {
    let sectionToUpdate = await this.sectionRepository.findOne({
      where: {
        id: section_id,
      },
    });
    sectionToUpdate = { ...sectionToUpdate, ...section };
    sectionToUpdate.updatedBy = current_user_id;
    return await this.sectionRepository.save(sectionToUpdate);
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

  async deleteSectionsByBlogId(blog_id: string) {
    const sections = await this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.blog', 'blog')
      .where('blog.id = :blogId', {
        blogId: blog_id,
      })
      .getMany();
    if (!sections) {
      throw new Error('Sections not found');
    }
    sections.forEach((section) => {
      section.isDeleted = true;
    });
    return await this.manager.save(sections);
  }
}
