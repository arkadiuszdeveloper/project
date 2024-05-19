import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGateway } from './auth.gateway';
import { JwtAuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { RsaService } from 'src/shared/rsa/rsa.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    AuthGateway,
    AuthService,
    JwtAuthGuard,
    UsersService,
    MailService,
    RsaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
