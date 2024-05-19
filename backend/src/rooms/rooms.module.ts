import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from 'src/auth/auth.service';
import { RsaService } from 'src/shared/rsa/rsa.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Message } from 'src/messages/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, Message])],
  providers: [
    RoomsGateway,
    RoomsService,
    MailService,
    AuthService,
    RsaService,
    UsersService,
    MessagesService,
  ],
})
export class RoomsModule {}
