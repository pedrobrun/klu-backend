import { Module } from '@nestjs/common';
import { ConversationsSeedService } from './conversation/conversations-seed.service';

@Module({
  providers: [ConversationsSeedService],
})
export class DataSeedsModule {}
