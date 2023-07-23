import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message } from './message.schema';
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

  @Prop({ type: String, required: false, index: true })
  prevMessageValue?: string;

  @Prop({ enum: MessageTypeEnum, required: false, index: true })
  prevMessageType?: MessageTypeEnum;

  @Prop({ type: String, required: false })
  nextMessageValue?: string;

  @Prop({ enum: MessageTypeEnum, required: false })
  nextMessageType?: MessageTypeEnum;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
