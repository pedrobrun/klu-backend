import { Injectable } from '@nestjs/common';
import { Conversation } from './conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConversationDto } from '../domain/dtos/create-conversation.dto';
import { ConversationEntity } from '../domain/conversation.entity';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createOne(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationEntity> {
    return await this.conversationModel.create(createConversationDto);
  }
}
