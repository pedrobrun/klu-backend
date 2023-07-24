import { IsEnum, IsOptional, IsString } from 'class-validator';
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
  nextMessageType?: MessageTypeEnum;

  @IsOptional()
  @IsString()
  prevMessageValue?: string;

  @IsOptional()
  @IsEnum(MessageTypeEnum)
  prevMessageType?: MessageTypeEnum;
}
