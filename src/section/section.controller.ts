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
import { Created, SuccessResponse } from 'src/core/success.response';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}
  @Post('create')
  async createSection(
    @Body() section: SectionDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return new Created({
      message: 'Create section successfully',
      metadata: await this.sectionService.createSection(
        section,
        current_user_id,
      ),
    });
  }

  @Get()
  async getSectionsByBlogId(@Query('blog_id') blog_id: string) {
    return new SuccessResponse({
      message: 'Get sections successfully',
      metadata: await this.sectionService.getSectionsByBlogId(blog_id),
    });
  }

  @Get()
  async getSectionById(@Query('section_id') section_id: string) {
    return new SuccessResponse({
      message: 'Get section successfully',
      metadata: await this.sectionService.getSectionById(section_id),
    });
  }

  @Patch()
  async updateSection(
    @Query('section_id') section_id: string,
    @Body(new ValidationPipe({ transform: true })) section: SectionDto,
    @GetCurrentUserId() current_user_id: string,
  ) {
    return new SuccessResponse({
      message: 'Update section successfully',
      metadata: await this.sectionService.updateSection(
        section_id,
        section,
        current_user_id,
      ),
    });
  }

  @Delete('delete')
  async deleteSection(@Query('section_id') section_id: string) {
    return new SuccessResponse({
      message: 'Delete section successfully',
      metadata: await this.sectionService.deleteSection(section_id),
    });
  }
}
