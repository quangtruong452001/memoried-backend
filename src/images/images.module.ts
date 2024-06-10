import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImagesProvider } from './images.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/database/entities/images.entity';
import { SectionModule } from 'src/section/section.module';
import { Section } from 'src/database/entities/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Images, Section]), SectionModule],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesProvider],
  exports: [ImagesService, ImagesProvider],
})
export class ImagesModule {}
