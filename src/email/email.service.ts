import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { ConfigurationKeyPaths } from 'src/config/configuration';
// TQCUZCPUDOXOUBUY
@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor(private configService: ConfigService<ConfigurationKeyPaths>) {
    this.transporter = createTransport({
      host: this.configService.get('mailer.host'),
      port: this.configService.get('mailer.port'),
      secure: this.configService.get('mailer.secure'),
      auth: {
        user: this.configService.get<string>('mailer.auth.user'),
        pass: this.configService.get<string>('mailer.auth.pass'),
      },
    });
  }
  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: 'redrun_admin',
        address: 'zhr19853149156@163.com',
      },
      to,
      subject,
      html,
    });
  }
}
