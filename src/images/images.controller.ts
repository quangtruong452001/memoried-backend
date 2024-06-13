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

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('section_id') section_id: string,
  ) {
    return this.imagesService.uploadImage(files, section_id);
  }

  @Get()
  getPicture(@Query('section_id') section_id: string) {
    return this.imagesService.getImagesBySectionId(section_id);
  }

  @Patch('delete')
  deleteImage(@Query('image_id') image_id: string) {
    return this.imagesService.deleteImage(image_id);
  }
}
