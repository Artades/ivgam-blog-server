import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PostsController],
  providers: [PostsService, EmailService]
})
export class PostsModule {}
