import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { ConversationRepository } from '../infraestructure/conversation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from '../infraestructure/conversation.schema';
import { ConfigModule } from '@nestjs/config';

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        MongooseModule.forFeature([
          { name: Conversation.name, schema: ConversationSchema },
        ]),
      ],
      providers: [ConversationService, ConversationRepository],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});
