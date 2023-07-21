import { Module } from '@nestjs/common';
import { ConversationController } from './http/conversation.controller';
import { ConversationService } from './service/conversation.service';
import {
  Conversation,
  ConversationSchema,
} from './infraestructure/conversation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
