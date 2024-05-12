import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserProps } from './users.types';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/enums/role.enum';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly database: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public async findOneByEmail(email: string): Promise<UserProps> {
    try {
      const user = await this.database.prisma.user.findUnique({
        where: { email },
      });
      return user as UserProps;
    } catch (error) {
      console.log('Error finding user by Email', email);
    }
  }
  public async findOne(jwtToken: string): Promise<UserProps | null> {
    try {
      const decodedJwtToken = this.jwtService.decode(jwtToken);
      const user = await this.database.prisma.user.findUnique({
        where: { email: decodedJwtToken.email },
        include: {favorites: true}
      });

      return user as UserProps;
    } catch (error) {
      console.error('Something went wrong while finding a user: ', error);

      throw new InternalServerErrorException();
    }
  }

  public async findOneById(id: number) : Promise<UserProps> {
     try {
       
       const user = await this.database.prisma.user.findUnique({
         where: { id },
         include: {favorites: true}
       });

       return user as UserProps;
     } catch (error) {
       console.error('Something went wrong while finding a user by id: ', error);

       throw new InternalServerErrorException();
     }
  }

  public async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<Omit<UserProps, 'hashedPassword'>> {
    try {
      const user = await this.database.prisma.user.create({
        data: {
          name,
          email,
          hashedPassword: await bcrypt.hash(password, 5),
          role: process.env.AUTHOR_EMAILS.split(',').includes(email)
            ? Role.AUTHOR
            : Role.READER,

          favorites: { create: [] },
        },
      });

      console.log("USER AFTER CREATING: ", user)
      const { hashedPassword, ...userData } = user;

      return userData as UserProps;
    } catch (error) {
      console.error('Something went wrong while creating a user: ', error);

      throw new InternalServerErrorException();
    }
  }
}
