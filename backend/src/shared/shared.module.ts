import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedGateway } from './shared.gateway';
import { RsaService } from './rsa/rsa.service';
import { LinkPreviewService } from './link-preview/link-preview.service';

@Module({
  providers: [SharedGateway, SharedService, RsaService, LinkPreviewService],
})
export class SharedModule {}
