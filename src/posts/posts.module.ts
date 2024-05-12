import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PostsController],
  providers: [PostsService, EmailService, UsersService]
})
export class PostsModule {}
