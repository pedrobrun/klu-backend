import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from '../domain/dtos/create-conversation.dto';
import { ConversationRepository } from '../infraestructure/conversation.repository';
import { ConversationEntity } from '../domain/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async createOne(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationEntity> {
    return await this.conversationRepository.createOne(createConversationDto);
  }
}
