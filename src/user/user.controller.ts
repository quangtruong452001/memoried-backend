import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/database/dto';
import { Body, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { convertImageToBase64, getInfoData } from 'src/utils';
import { GetCurrentUserId } from 'src/decorators/getCurrentUserId.decorator';
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
    const avatarBase64 = convertImageToBase64(file);
    createUserDto.avatar = avatarBase64;
    return this.userService.updateUser(user_id, createUserDto);
  }

  @Get('get-user-jwt')
  async getCurrentUser(@GetCurrentUserId() user_id: string) {
    const user = await this.userService.getUserById(user_id);
    return getInfoData({
      fields: ['username', 'id', 'avatar', 'role'],
      object: user,
    });
  }
}
