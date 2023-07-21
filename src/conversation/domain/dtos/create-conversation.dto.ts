import { IsArray, IsString } from 'class-validator';
import { MessageEntity } from '../message.entity';
import { Type } from 'class-transformer';

export class CreateConversationDto {
  @IsString()
  id: string;

  @Type(() => MessageEntity)
  @IsArray({ each: true })
  conversations: Array<MessageEntity>;
}
