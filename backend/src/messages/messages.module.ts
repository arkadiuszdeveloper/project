import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { AuthService } from 'src/auth/auth.service';
import { RsaService } from 'src/shared/rsa/rsa.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { MailService } from 'src/mail/mail.service';
import { Message } from './entities/message.entity';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, Message])],
  providers: [
    MessagesGateway,
    MessagesService,
    UsersService,
    RoomsService,
    AuthService,
    RsaService,
    MailService,
  ],
})
export class MessagesModule {}
