import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/database/dto';
import { Body, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import mime from 'mime';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Body('user_id') user_id: string,
  ) {
    const mimeType = mime.lookup(file.originalname);
    const base64Prefix = `data:${mimeType};base64,`;
    const avatarBase64 = base64Prefix + file.buffer.toString('base64');
    createUserDto.avatar = avatarBase64;
    return this.userService.updateUser(user_id, createUserDto);
  }
}
