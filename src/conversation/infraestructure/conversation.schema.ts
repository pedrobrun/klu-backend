import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MessageTypeEnum } from '../domain/message-type.enum';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop(String)
  externalId: string;

  @Prop({ index: true, enum: MessageTypeEnum })
  from: MessageTypeEnum;

  @Prop({ index: true, type: String })
  value: string;

  @Prop(String)
  nextMessageValue: string;

  @Prop(MessageTypeEnum)
  nextMessageType: MessageTypeEnum;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
