import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ConversationService } from 'src/conversation/service/conversation.service';

@Injectable()
export class ConversationsSeedCommand {
  constructor(private readonly conversationService: ConversationService) {}

  @Command({
    command: 'seed:conversations',
    describe: 'seed conversations',
  })
  async create() {
    console.log('hey');
  }
}
