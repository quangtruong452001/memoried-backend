import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Section } from 'src/database/entities/section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Section])],
  providers: [SectionService],
  controllers: [SectionController],
})
export class SectionModule {}
