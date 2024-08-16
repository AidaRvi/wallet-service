import { IsNotEmpty, IsUUID } from 'class-validator';

export class getBalanceDTO {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
