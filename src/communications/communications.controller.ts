import { Body, Controller, Post } from '@nestjs/common';
import { CommunicationsService } from './communications.service';

@Controller('webhooks/whatsapp')
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Post('incoming')
  handleIncoming(@Body() body: any) {
    return this.communicationsService.handleIncomingMessage(body);
  }
}