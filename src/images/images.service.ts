import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Images } from 'src/database/entities/images.entity';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { ImageDto } from 'src/database/dto/image.dto';
import { Section } from 'src/database/entities/section.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private imageRepository: Repository<Images>,
    private manager: EntityManager,
  ) {}

  async createImage(
    imageDto: ImageDto,
    current_user_id: string,
  ): Promise<Images> {
    try {
      const newImage = new Images(imageDto);
      newImage.createdBy = current_user_id;
      newImage.updatedBy = current_user_id;
      return await this.imageRepository.save(newImage);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async uploadImage(
    files: Express.Multer.File[],
    section_id: string,
    current_user_id: string,
  ): Promise<string[]> {
    if (!files || !Array.isArray(files)) {
      throw new Error('No files provided or files is not an array.');
    }
    try {
      const uploadPromises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const upload = v2.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            const image = new ImageDto();
            image.url = result.url;
            image.section = section_id;
            this.createImage(image, current_user_id);
            resolve('Image uploaded successfully');
          });
          toStream(file.buffer).pipe(upload);
        });
      });
      return Promise.all(uploadPromises);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getImagesBySectionId(
    section_id: string,
  ): Promise<{ id: string; url: string }[]> {
    try {
      const images = await this.imageRepository
        .createQueryBuilder('image')
        .leftJoinAndSelect('image.section', 'section')
        .where('section.id = :sectionId', { sectionId: section_id })
        .andWhere('section.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('image.isDeleted = :imageIsDeleted', {
          imageIsDeleted: false,
        })
        .getMany();

      console.log(images);

      return images.map((image) => ({
        id: image.id,
        url: image.url,
      }));
    } catch (error) {
      console.error('Error fetching images:', error); // Add logging
      throw new BadRequestException(error.message);
    }
  }

  async deleteImage(image_id: string) {
    try {
      const image = await this.imageRepository.findOne({
        where: {
          id: image_id,
        },
      });
      if (!image) {
        throw new NotFoundException('Image not found');
      }
      image.isDeleted = true;
      return await this.manager.save(image);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
