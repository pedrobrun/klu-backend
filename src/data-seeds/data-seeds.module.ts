import { Module } from '@nestjs/common';
import { ConversationsSeedService } from './conversations/conversations-seed.service';

@Module({
  providers: [ConversationsSeedService],
})
export class DataSeedsModule {}
