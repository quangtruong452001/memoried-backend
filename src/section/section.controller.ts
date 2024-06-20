import {
  Post,
  Body,
  Get,
  Patch,
  Controller,
  Query,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionDto } from 'src/database/dto/section.dto';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}
  @Post('create')
  createSection(
    @Body() section: SectionDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.sectionService.createSection(section, current_user_id);
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
    @Body(new ValidationPipe({ transform: true })) section: SectionDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return this.sectionService.updateSection(
      section_id,
      section,
      current_user_id,
    );
  }

  @Delete('delete')
  deleteSection(@Query('section_id') section_id: string) {
    return this.sectionService.deleteSection(section_id);
  }

  @Patch('delete')
  deleteSectionsByBlogId(@Query('blog_id') blog_id: string) {
    return this.sectionService.deleteSection(blog_id);
  }
}
