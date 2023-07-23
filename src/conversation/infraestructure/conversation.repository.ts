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

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationEntity> {
    return await this.conversationModel.create(createConversationDto);
  }

  async getAll() {
    return await this.conversationModel.find();
  }

  async createMany(createConversationDto: CreateConversationDto[]) {
    return await this.conversationModel.insertMany(createConversationDto);
  }

  async findById(id: string) {
    return await this.conversationModel.find({ id });
  }

  async findByIds(ids: string[]) {
    return await this.conversationModel.find({ id: { $in: ids } });
  }

  async findByMessage(message: { from: string; value: string }) {
    return await this.conversationModel.findOne({
      'conversations.from': message.from,
      'conversations.value': message.value,
    });
  }
}
