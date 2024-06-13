import { Injectable } from '@nestjs/common';
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
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
  ) {}

  async createImage(imageDto: ImageDto): Promise<Images> {
    const section = await this.sectionRepository.findOne({
      where: { id: imageDto.section_id },
    });

    if (!section) {
      throw new Error('Section not found');
    }
    const newImage = new Images(imageDto);
    newImage.url = imageDto.url;
    newImage.section = imageDto.section_id;

    return await this.imageRepository.save(newImage);
  }

  async updateImage(image_id: string, image: Images) {
    let imageToUpdate = await this.imageRepository.findOne({
      where: {
        id: image_id,
      },
    });
    imageToUpdate = { ...imageToUpdate, ...image };
    return await this.manager.save(imageToUpdate);
  }

  async uploadImage(
    files: Express.Multer.File[],
    section_id: string,
  ): Promise<string[]> {
    if (!files || !Array.isArray(files)) {
      throw new Error('No files provided or files is not an array.');
    }
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          var image = new ImageDto();
          image.url = result.url;
          image.section_id = section_id;
          this.createImage(image);
          resolve('Image uploaded successfully');
        });
        toStream(file.buffer).pipe(upload);
      });
    });
    return Promise.all(uploadPromises);
  }

  async getImagesBySectionId(section_id: string) {
    const images = await this.imageRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.section', 'section')
      .where('section.id = :sectionId', {
        sectionId: section_id,
      })
      .getMany();
    return images.map((image) => image.url);
  }

  async deleteImage(image_id: string) {
    const image = await this.imageRepository.findOne({
      where: {
        id: image_id,
      },
    });
    if (!image) {
      throw new Error('Image not found');
    }
    image.isDeleted = true;
    return await this.manager.save(image);
  }
}
