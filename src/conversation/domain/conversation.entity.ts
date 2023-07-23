import { MessageEntity } from './message.entity';

export class ConversationEntity {
  readonly externalId: string;
  readonly conversations: Array<MessageEntity>;
}
