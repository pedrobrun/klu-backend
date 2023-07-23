import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsString()
  nextMessageValue?: string;

  @IsOptional()
  @IsEnum(MessageTypeEnum)
  nextMessageRole?: MessageTypeEnum;

  @IsOptional()
  @IsString()
  prevMessageValue?: string;

  @IsOptional()
  @IsEnum(MessageTypeEnum)
  prevMessageRole?: MessageTypeEnum;
}
