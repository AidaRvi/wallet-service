import { Controller, Get, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('api/v1')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/balance')
  async getBalance(
    @Query('user_id') userId: number,
  ): Promise<{ balance: number }> {
    const balance = await this.balanceService.getBalance(userId);
    return { balance };
  }
}
