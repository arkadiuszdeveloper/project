import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateTextMessageDto } from './dto/create-text-message.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomsService } from 'src/rooms/rooms.service';

@WebSocketGateway({ namespace: 'messages' })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly roomService: RoomsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('sendTextMessage')
  async createTextMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateTextMessageDto,
  ) {
    const ownerId = client.data.userId;
    const roomId = createMessageDto.roomId;

    const room = await this.roomService.findOne(ownerId, roomId);
    const message = await this.messagesService.createTextMessage(
      client.data.userId,
      createMessageDto,
      room.readonly,
    );

    const jsonPayload = Buffer.from(message.payload, 'base64').toString();

    const newMessage = {
      ...message,
      payload: JSON.parse(jsonPayload),
    };
    room.relatedIds
      .filter((userId) => userId !== ownerId)
      .map((userId) => {
        this.server.emit(`user:${userId}`, newMessage);
      });

    return newMessage;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getMessages')
  getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId, offset }: { roomId: number; offset: number },
  ) {
    return this.messagesService.getMessages(client.data.userId, roomId, offset);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getMessage')
  async getMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() { messageId }: { messageId: number },
  ) {
    const userId = client.data.userId;
    const msg = await this.messagesService.getMessage(userId, messageId);

    if (!msg) {
      return null;
    }

    if (msg.ownerId === client.data.userId) {
      return msg;
    }

    const room = await this.roomService.findOne(userId, msg.roomId);
    if (!room?.relatedIds.includes(userId)) {
      return null;
    }

    return msg;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('seenMessage')
  seenMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() { messageId }: { messageId: number },
  ) {
    return this.messagesService.seenMessage(client.data.userId, messageId);
  }
}
