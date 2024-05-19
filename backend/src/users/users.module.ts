import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from 'src/auth/auth.service';
import { RsaService } from 'src/shared/rsa/rsa.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersGateway, UsersService, MailService, AuthService, RsaService],
})
export class UsersModule {}
