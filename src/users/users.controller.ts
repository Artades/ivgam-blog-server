import {
  Controller,
  NotFoundException,
  Get,
  UseGuards,
  Body,
  Patch,
  Request,
} from '@nestjs/common';
import { UserProps, UserControllerProps, UserServiceProps } from './users.types';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';


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
}
