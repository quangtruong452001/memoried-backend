import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Section } from 'src/database/entities/section.entity';
import { SectionDto } from 'src/database/dto/section.dto';
import { Blog } from 'src/database/entities/blog.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    private manager: EntityManager,
  ) {}

  async createSection(section: SectionDto, current_user_id: string) {
    try {
      const blog = await this.manager.findOne(Blog, {
        where: { id: section.blog_id },
      });

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }
      const newSection = new Section({
        caption: section.caption,
        blog: blog, // Assign the blog entity
        createdBy: current_user_id,
        updatedBy: current_user_id,
      });
      return await this.manager.save(newSection);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSectionById(section_id: string) {
    try {
      return await this.sectionRepository.findOne({
        where: { id: section_id, isDeleted: true },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSectionsByBlogId(blog_id: string) {
    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateSection(
    section_id: string,
    section: SectionDto,
    current_user_id: string,
  ) {
    try {
      let sectionToUpdate = await this.sectionRepository.findOne({
        where: {
          id: section_id,
        },
      });
      sectionToUpdate = { ...sectionToUpdate, ...section };
      sectionToUpdate.updatedBy = current_user_id;
      return await this.sectionRepository.save(sectionToUpdate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteSection(section_id: string) {
    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteSectionsByBlogId(blog_id: string) {
    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
