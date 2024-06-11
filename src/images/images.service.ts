import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Images } from 'src/database/entities/images.entity';
import { v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';
import { ImageDTO } from 'src/database/dto/image.dto';
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

  async createImage(imageDto: ImageDTO): Promise<Images> {
    const section = await this.sectionRepository.findOne({
      where: { id: imageDto.section_id },
    });

    if (!section) {
      throw new Error('Section not found');
    }
    const newImage = new Images(imageDto);
    newImage.url = imageDto.url;
    newImage.section = section;

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
          var image = new ImageDTO();
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
}
