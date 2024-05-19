import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { RoomsModule } from './rooms/rooms.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { RsaService } from './shared//rsa/rsa.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MessagesModule } from './messages/messages.module';

const jwtConfig: JwtModuleOptions = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRESIN },
};

const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  autoLoadEntities: true,
};

const mailerConfig: MailerOptions = {
  transport: {
    secure: false,
    host: process.env.MAIL_SMTP,
    auth: {
      user: process.env.MAIL_LOGIN,
      pass: process.env.MAIL_PASS,
    },
  },
};

@Module({
  imports: [
    JwtModule.register(jwtConfig),
    TypeOrmModule.forRoot(postgresConfig),
    MailerModule.forRoot(mailerConfig),
    UsersModule,
    MailModule,
    RoomsModule,
    AuthModule,
    SharedModule,
    MessagesModule,
  ],
  providers: [RsaService],
})
export class AppModule {}
