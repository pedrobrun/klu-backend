import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConversationService } from '../service/conversation.service';
import { SeedConversationsDto } from '../domain/dtos/seed-conversations.dto';
import { CreateCompletionDto } from '../domain/dtos/create-completion.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('seed')
  async seedConversations(@Body() seedConversationsDto: SeedConversationsDto) {
    this.conversationService.seed(seedConversationsDto);
    return { message: 'Running seed.' };
  }

  @Post('completion')
  async createCompletion(@Body() createCompletionDto: CreateCompletionDto) {
    return await this.conversationService.createCompletion(createCompletionDto);
  }
}
