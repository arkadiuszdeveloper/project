import { Injectable } from '@nestjs/common';
import { CreateTextMessageDto } from './dto/create-text-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  createTextMessage(
    ownerId: number,
    createMessageDto: CreateTextMessageDto,
    roomReadonly: boolean,
  ) {
    const { roomId, crypted, message, replied_to_message_id } =
      createMessageDto;

    const payload = JSON.stringify({
      type: 'text',
      message,
    });

    const messageData = {
      roomId,
      ownerId,
      crypted,
      payload: Buffer.from(payload).toString('base64'),
      replied_to_message_id,
      viewedIds: [ownerId],
    };

    if (roomReadonly) {
      return messageData;
    }

    return this.messageRepository.save(messageData);
  }

  async getMessages(userId: number, roomId: number, offset: number) {
    const messages = await this.messageRepository.findBy({ roomId });

    return messages.splice(offset, offset + 10000).map((m) => {
      const { payload, ...rest } = m;
      const json = Buffer.from(payload, 'base64').toString();
      return { payload: JSON.parse(json), ...rest };
    });
  }

  async getMessage(userId: number, messageId: number) {
    const m = await this.messageRepository.findOneBy({ id: messageId });
    const { payload, ...rest } = m;
    const json = Buffer.from(payload, 'base64').toString();
    return { payload: JSON.parse(json), ...rest };
  }

  async seenMessage(userId: number, id: number) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message) {
      return;
    }

    const viewedIds = new Set(message.viewedIds);
    viewedIds.add(userId);

    this.messageRepository.save({
      ...message,
      viewedIds: Array.from(viewedIds),
    });
  }

  async getLastMessage(userId: number, roomId: number) {
    const message = await this.messageRepository.findOne({
      where: { roomId },
      order: {
        id: 'DESC',
      },
    });

    try {
      const { payload, ...rest } = message;
      const json = Buffer.from(payload, 'base64').toString();

      return { payload: JSON.parse(json), ...rest };
    } catch (error) {
      return;
    }
  }
}
