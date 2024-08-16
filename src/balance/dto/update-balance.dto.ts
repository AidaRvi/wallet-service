import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class updateBalanceDTO {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
