import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    username: string,
    useremail: string,
    subject: string,
    text: string,
    attachments: File[] = [],
  ) {
    const to = useremail;
    const from = useremail;
    const replyTo = `${username} <${useremail}>`;

    await this.mailerService.sendMail({
      to,
      from,
      replyTo,
      subject,
      text,
      attachments,
    });
  }
}
