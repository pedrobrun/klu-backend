import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message } from './message.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop(String)
  externalId: string;

  @Prop(Array<Message>)
  conversations: Array<Message>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
