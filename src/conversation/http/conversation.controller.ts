import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConversationService } from '../service/conversation.service';
import { SeedConversationsDto } from '../domain/dtos/seed-conversations.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('seed')
  async seedConversations(@Body() seedConversationsDto: SeedConversationsDto) {
    await this.conversationService.seed(seedConversationsDto);
  }
}
