import { IsString } from 'class-validator';

export class SeedConversationsDto {
  @IsString()
  secret: string;
}
