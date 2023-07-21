import { MessageEntity } from './message.entity';

export class ConversationEntity {
  readonly id: string;
  readonly conversations: Array<MessageEntity>;
}
