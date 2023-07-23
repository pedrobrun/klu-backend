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
import { MessageTypeEnum } from '../domain/message-type.enum';

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
            const formattedBatch: CreateConversationDto[] = batch
              .map((data) => {
                let conversationDtos: CreateConversationDto[] = [];
                data.conversations.forEach((convo, index) => {
                  let dto: CreateConversationDto = {
                    externalId: data.externalId,
                    from: convo.from as MessageTypeEnum,
                    value: convo.value,
                    nextMessageValue:
                      data.conversations[index + 1]?.value || undefined,
                    nextMessageRole:
                      data.conversations[index + 1]?.from || undefined,
                    prevMessageValue:
                      data.conversations[index - 1]?.value || undefined,
                    prevMessageRole:
                      data.conversations[index - 1]?.from || undefined,
                  };
                  conversationDtos.push(dto);
                });
                return conversationDtos;
              })
              .flat();

            await this.conversationRepository.createMany(formattedBatch);
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
            pendingPromises.push(this.checkBatchInsertions(batch));
            batch = [];
            pipeline.resume();
          }
          return null; // To not propagate downstream
        },
      ]);

      pipeline.on('end', async () => {
        try {
          if (batch.length > 0) {
            pendingPromises.push(this.checkBatchInsertions(batch));
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

  async checkBatchInsertions(idBatch: string[]) {
    const conversations = await this.conversationRepository.findByExternalIds(
      idBatch,
    );
    const foundIds = new Set(conversations.map((c) => c.externalId));
    return idBatch.filter((id) => !foundIds.has(id));
  }

  async createCompletion({ messages }: CreateCompletionDto): Promise<{
    choices: { from: MessageTypeEnum; value: string }[];
  }> {
    const lastMessage = messages[messages.length - 1];
    const previousMessage = messages[messages.length - 2];

    const conversation = await this.conversationRepository.findByMessage({
      message: lastMessage,
      previousMessage,
    });

    if (!conversation || conversation.length === 0) {
      throw new NotFoundException('No completion found for this message');
    }

    return {
      choices: conversation.map((convo) => ({
        from: convo.nextMessageRole,
        value: convo.nextMessageValue,
      })),
    };
  }
}
