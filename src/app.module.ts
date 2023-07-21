import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationsModule } from './conversations/conversations.module';
import { DataSeedsModule } from './data-seeds/data-seeds.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ConfigModule.forRoot(),
    ConversationsModule,
    DataSeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
