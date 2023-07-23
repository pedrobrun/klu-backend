import { MessageTypeEnum } from './message-type.enum';

export class ConversationEntity {
  readonly externalId: string;
  readonly from: MessageTypeEnum;
  readonly value: string;
  readonly nextMessageValue: String;
  readonly nextMessageType: MessageTypeEnum;
}
