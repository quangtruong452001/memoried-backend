import { Post, Body, Get, Patch, Controller, Query } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionDto } from 'src/database/dto/section.dto';
import { Section } from 'src/database/entities/section.entity';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}
  @Post()
  createSection(@Body() section: SectionDto) {
    return this.sectionService.createSection(section);
  }

  @Get()
  getSectionsByBlogId(@Query('blog_id') blog_id: string) {
    return this.sectionService.getSectionsByBlogId(blog_id);
  }

  @Get()
  getSectionById(@Query('section_id') section_id: string) {
    return this.sectionService.getSectionById(section_id);
  }

  @Patch()
  updateSection(
    @Query('section_id') section_id: string,
    @Body() section: Section,
  ) {
    return this.sectionService.updateSection(section_id, section);
  }

  @Patch('delete')
  deleteSection(@Query('section_id') section_id: string) {
    return this.sectionService.deleteSection(section_id);
  }
}
