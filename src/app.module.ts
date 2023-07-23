import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModule } from './conversation/conversation.module';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.dev', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ConversationModule,
    CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
