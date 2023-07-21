import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationsModule } from './conversations/conversations.module';
import { DataSeedsModule } from './data-seeds/data-seeds.module';

@Module({
  imports: [ConversationsModule, DataSeedsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
