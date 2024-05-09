import { Transporter } from 'nodemailer';

export interface IEmailService {
  public sendEmail(emailFrom: string, html: string): Promise<void>;
}
