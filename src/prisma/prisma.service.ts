import { Injectable } from '@nestjs/common';
import { PrismaServiceProps } from './prisma.types';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements PrismaServiceProps {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}
