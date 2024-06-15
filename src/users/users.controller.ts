import {
  Controller,
  NotFoundException,
  Get,
  UseGuards,
  Body,
  Patch,
  Request,
  ParseIntPipe,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import {  UserControllerProps, UserProps } from './users.types';


@Controller('users')
@ApiTags('users')
export class UsersController implements UserControllerProps {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  public async findOne(@Request() req: any): Promise<UserProps | null> {
    const jwtToken = req.headers.authorization?.split(' ')[1];
    const user = await this.userService.findOne(jwtToken);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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

  @Get('/findOneByEmail/:userEmail')
  public async findOneByEmail(
    @Param('userEmail') userEmail: string,
  ): Promise<UserProps> {
    const user = await this.userService.findOneByEmail(userEmail);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch('/profilePicture')
  async updateProfilePicture(
    @Body() updateProfilePictureDto: {id: number, profilePicture: string},
  ):Promise<{success: boolean}> {
    const { id, profilePicture } = updateProfilePictureDto;
   
      const result = await this.userService.updateProfilePicture(
        id,
        profilePicture,
      );
      if(result.success) {
        console.log("Profile Picture has been set successfully")
      }
      return result;
  }
}
