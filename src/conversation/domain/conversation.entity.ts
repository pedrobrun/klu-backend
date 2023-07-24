import { MessageTypeEnum } from './message-type.enum';

export class ConversationEntity {
  readonly externalId: string;
  readonly from: MessageTypeEnum;
  readonly value: string;
  readonly nextMessageValue?: string;
  readonly nextMessageType?: MessageTypeEnum;
  readonly prevMessageValue?: string;
  readonly prevMessageType?: MessageTypeEnum;
}
