import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/database/entities/blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
