import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateConversationDto } from '../domain/dtos/create-conversation.dto';
import { ConversationRepository } from '../infraestructure/conversation.repository';
import { ConversationEntity } from '../domain/conversation.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { SeedConversationsDto } from '../domain/dtos/seed-conversations.dto';

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
    console.log('Starting conversations seed');

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
            console.error('error', e.message);
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
          console.error('error');
          process.exit(1);
        }
        console.timeEnd('timer');
        console.log('Data seeding completed');
      }
    });
  }

  async findAndLogMissingRecords(idBatch: string[]) {
    const conversations = await this.conversationRepository.findByIds(idBatch);
    const foundIds = new Set(conversations.map((c) => c.id));
    for (const id of idBatch) {
      if (!foundIds.has(id)) {
        console.log('Missing record with id:', id);
      }
    }
  }
}
