export class CreateTextMessageDto {
  roomId: number;
  crypted: boolean;
  message: string;
  replied_to_message_id: number;
}
