import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role.guard';
import { EmailModule } from './email/email.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    PostsModule,
    EmailModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
