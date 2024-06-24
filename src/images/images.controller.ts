import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Get,
  Body,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
import { Created, SuccessResponse } from 'src/core/success.response';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('section_id') section_id: string,
    @GetCurrentUserId() current_user_id: string,
  ) {
    // console.log('Check id', section_id);
    return new Created({
      message: 'Images uploaded successfully',
      metadata: await this.imagesService.uploadImage(
        files,
        section_id,
        current_user_id,
      ),
    });
  }

  @Get()
  async getPicture(@Query('section_id') section_id: string) {
    return new SuccessResponse({
      message: 'Images fetched successfully',
      metadata: await this.imagesService.getImagesBySectionId(section_id),
    });
  }

  @Patch('delete')
  async deleteImage(@Query('image_id') image_id: string) {
    return new SuccessResponse({
      message: 'Image deleted successfully',
      metadata: await this.imagesService.deleteImage(image_id),
    });
  }
}
