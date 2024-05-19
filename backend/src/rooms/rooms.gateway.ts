import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'rooms' })
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createFriendRoom')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    createRoomDto: CreateRoomDto,
  ) {
    const { relatedIds, readonly } = createRoomDto;
    const userId = client.data.userId;
    const relatedIdsData = relatedIds.includes(userId)
      ? createRoomDto.relatedIds
      : [userId, ...createRoomDto.relatedIds];

    const room = await this.roomsService.createRoom(
      userId,
      relatedIdsData,
      readonly,
    );

    room.relatedIds
      .filter((id) => id !== userId)
      .map((id) => {
        this.server.emit(`user:${id}`, room);
      });

    return room;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('findAll')
  findAll(@ConnectedSocket() client: Socket) {
    return this.roomsService.findAll(client.data.userId);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('findOne')
  findOne(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    return this.roomsService.findOne(client.data.userId, roomId);
  }
}
