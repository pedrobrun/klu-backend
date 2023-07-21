import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MessageTypeEnum } from '../domain/message-type.enum';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop(MessageTypeEnum)
  from: MessageTypeEnum; // todo: this will be an enum

  @Prop(String)
  value: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
