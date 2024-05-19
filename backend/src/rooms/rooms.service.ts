import { Injectable } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RsaService } from 'src/shared/rsa/rsa.service';
import { UsersService } from 'src/users/users.service';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly mailService: MailService,
    private readonly rsaService: RsaService,
    private readonly userService: UsersService,
    private readonly messageService: MessagesService,
  ) {}

  async create(
    adminIds: number[],
    relatedIds: number[],
    name: string,
    readonly: boolean,
  ) {
    const { privateKey, publicKey } = await this.rsaService.generateRSAKeyPair(
      '',
    );
    const publicKeyBase64 = await this.rsaService.convertKeyToBase64(
      privateKey,
    );

    return this.roomRepository.save({
      relatedIds,
      adminIds,
      name,
      privateKey: privateKey,
      readonly,
    });
  }

  async createRoom(userId: number, relatedIds: number[], readonly: boolean) {
    const relatedUsers = await Promise.all(
      relatedIds.map(async (id) => await this.userService.findOne(id)),
    );

    const ids = relatedUsers.map((u) => u.id);
    const name = relatedUsers.map((u) => `${u.firstName} ${u.lastName}`);

    return this.create([userId], ids, name.join(', '), readonly);
  }

  async findAll(userId: number): Promise<Omit<Room, 'privateKey'>[]> {
    const rooms = await this.roomRepository
      .createQueryBuilder('room')
      .where(':userId = ANY(room.relatedIds)', { userId })
      .getMany();

    return Promise.all(
      rooms.map(async (room) => {
        const lastMessage = await this.messageService.getLastMessage(
          userId,
          room.id,
        );

        delete room.privateKey;
        return { ...room, lastMessage: lastMessage };
      }),
    );
  }

  async findOne(
    userId: number,
    roomId: number,
  ): Promise<Omit<Room, 'privateKey'>> {
    const room = await this.roomRepository
      .createQueryBuilder('room')
      .where(':roomId = room.id', { roomId })
      .andWhere(':userId = ANY(room.relatedIds)', { userId })
      .getOne();

    if (!room) {
      return null;
    }

    delete room.privateKey;
    return room;
  }
}
