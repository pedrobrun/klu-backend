import { IsArray, IsObject } from 'class-validator';
import { MessageEntity } from '../message.entity';
import { Type } from 'class-transformer';

export class CreateCompletionDto {
  @Type(() => MessageEntity)
  @IsArray()
  @IsObject({ each: true })
  messages: Array<MessageEntity>;
}
