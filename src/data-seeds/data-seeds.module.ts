import { Module } from '@nestjs/common';
import { ConversationsSeedService } from './conversation/conversations-seed.service';
import { ConversationModule } from 'src/conversation/conversation.module';
import { ConversationsSeedCommand } from './conversation/conversations-seed.command';

@Module({
  imports: [ConversationModule],
  providers: [ConversationsSeedService, ConversationsSeedCommand],
})
export class DataSeedsModule {}
