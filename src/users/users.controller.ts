import {
  Controller,
  NotFoundException,
  Get,
  Body,
  Patch,
  ParseIntPipe,
  Param,

} from '@nestjs/common';

import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import {  UserControllerProps, UserProps, UserWithoutPassword } from './users.types';


@Controller('users')
@ApiTags('users')
export class UsersController implements UserControllerProps {
  constructor(private readonly userService: UsersService) {}



  @Patch('/profilePicture')
  async updateProfilePicture(
    @Body() updateProfilePictureDto: { id: number; profilePicture: string },
  ): Promise<{ success: boolean }> {
    const { id, profilePicture } = updateProfilePictureDto;

    const result = await this.userService.updateProfilePicture(
      id,
      profilePicture,
    );
    if (result.success) {
      console.log('Profile Picture has been set successfully');
    }
    return result;
  }

  @Get('/activeUsers')
  public async getActiveUsers(
   
  ): Promise<UserWithoutPassword[]> {
    const users = await this.userService.getActiveUsers();

    if (!users) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }


  @Get('/findOneById/:userId')
  public async findOneById(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserProps> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
