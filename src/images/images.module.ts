import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImagesProvider } from './images.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/database/entities/images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Images])],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesProvider],
  exports: [ImagesService, ImagesProvider],
})
export class ImagesModule {}
