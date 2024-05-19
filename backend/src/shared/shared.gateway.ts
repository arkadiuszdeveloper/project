import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { LinkPreviewService } from './link-preview/link-preview.service';

@WebSocketGateway()
export class SharedGateway {
  constructor(private readonly linkPreviewService: LinkPreviewService) {}

  @SubscribeMessage('getLinkPreview')
  getLinkPreview(@MessageBody() url: string) {
    return this.linkPreviewService.getPreviewData(url);
  }
}
