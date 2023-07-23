import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateConversationDto } from '../domain/dtos/create-conversation.dto';
import { ConversationRepository } from '../infraestructure/conversation.repository';
import { ConversationEntity } from '../domain/conversation.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { SeedConversationsDto } from '../domain/dtos/seed-conversations.dto';
import { CreateCompletionDto } from '../domain/dtos/create-completion.dto';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<ConversationEntity> {
    return await this.conversationRepository.create(createConversationDto);
  }

  async seed({ secret }: SeedConversationsDto) {
    if (secret !== process.env.SEED_SECRET) {
      throw new UnauthorizedException('Invalid secret.');
    }

    console.time('timer');
    Logger.log('Starting conversations seed');

    const batch = [];
    const batchSize = Number(process.env.SEED_BATCH_SIZE);

    const pipeline = chain([
      createReadStream(join(process.cwd(), 'src/seed-data/conversations.json')),
      parser(),
      streamArray(),
      async ({
        _,
        value,
      }: {
        _: string;
        value: { id: string; conversations: { from: string; value: string }[] };
      }) => {
        const { id, ...rest } = value;
        batch.push({ ...rest, externalId: id });

        if (batch.length >= batchSize) {
          pipeline.pause();
          try {
            await this.conversationRepository.createMany(batch);
          } catch (e) {
            Logger.error('error', e.message);
            process.exit(1);
          }
          batch.length = 0;
          pipeline.resume();
        }
        return null; // To not propagate downstream
      },
    ]);

    pipeline.on('end', async () => {
      if (batch.length > 0) {
        try {
          await this.conversationRepository.createMany(batch);
        } catch (e) {
          Logger.error('error');
          process.exit(1);
        }
        console.timeEnd('timer');
        Logger.log('Data seeding completed');
      }
    });
  }

  async testSeed({ secret }: SeedConversationsDto) {
    if (secret !== process.env.SEED_SECRET) {
      throw new UnauthorizedException('Invalid secret.');
    }

    console.time('timer');
    Logger.log('Starting seed testing...');

    let batch = [];
    const batchSize = 1000;
    const pendingPromises = [];

    return new Promise((resolve, reject) => {
      const pipeline = chain([
        createReadStream(
          join(process.cwd(), 'src/seed-data/conversations.json'),
        ),
        parser(),
        streamArray(),
        async ({ _, value }) => {
          batch.push(value.id);

          if (batch.length >= batchSize) {
            pipeline.pause();
            pendingPromises.push(this.findAndLogMissingRecords(batch));
            batch = [];
            pipeline.resume();
          }
          return null; // To not propagate downstream
        },
      ]);

      pipeline.on('end', async () => {
        try {
          if (batch.length > 0) {
            pendingPromises.push(this.findAndLogMissingRecords(batch));
          }

          const results = (await Promise.all(pendingPromises)).flat();

          console.timeEnd('timer');
          Logger.log('Data testing completed');
          if (results.length > 0) {
            resolve({
              ok: false,
              message: 'Some records were not found',
              notFound: results,
            });
          } else {
            resolve({ ok: true, message: 'All records were found' });
          }
        } catch (e) {
          Logger.error(e);
          reject(e);
        }
      });

      pipeline.on('error', reject);
    });
  }

  async findAndLogMissingRecords(idBatch: string[]) {
    const conversations = await this.conversationRepository.findByExternalIds(
      idBatch,
    );
    const foundIds = new Set(conversations.map((c) => c.externalId));
    return idBatch.filter((id) => !foundIds.has(id));
  }

  async createCompletion({
    messages,
  }: CreateCompletionDto): Promise<{ from: string; value: string }> {
    const lastMessage = messages[messages.length - 1];

    const conversation = await this.conversationRepository.findByMessage(
      lastMessage,
    );

    if (!conversation) {
      throw new NotFoundException('No completion found for this message');
    }

    const idx = conversation.conversations.findIndex(
      (msg) => msg.from === lastMessage.from && msg.value === lastMessage.value,
    );

    if (idx === -1 || idx + 1 >= conversation.conversations.length) {
      throw new NotFoundException('No completion found for this message');
    }

    return conversation.conversations[idx + 1];
  }
}
