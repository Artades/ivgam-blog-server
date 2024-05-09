import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { IEmailService } from './email.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService implements IEmailService {
  constructor() {}

  public async sendEmail(emailFrom: string, html: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      console.log(transporter);

      await transporter.sendMail({
        from: process.env.MAIL,
        to: "artyomkaaa19@gmail.com", // Sending to yourself for this example
        subject: 'Message from ' + `[ ${emailFrom} ]`,
        text: '',
        html,
      });

      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Something went wrong while sending a message: ', error);
    }
  }
}
