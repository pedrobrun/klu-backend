import { IsArray, IsEnum, IsString } from 'class-validator';
import { MessageEntity } from '../message.entity';
import { Type } from 'class-transformer';
import { MessageTypeEnum } from '../message-type.enum';

export class CreateConversationDto {
  @IsString()
  externalId: string;

  @IsEnum(MessageTypeEnum)
  from: MessageTypeEnum;

  @IsString()
  value: string;

  @IsString()
  nextMessageValue: string;

  @IsEnum(MessageTypeEnum)
  nextMessageType: MessageTypeEnum;
}
