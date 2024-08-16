import { Controller, Get, Body, Query, Post } from '@nestjs/common';
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

  @Post('/money')
  async updateBalance(
    @Body('user_id') userId: number,
    @Body('amount') amount: number,
  ): Promise<{ reference_id: number }> {
    const referenceId = await this.balanceService.updateBalance(userId, amount);
    return { reference_id: referenceId };
  }
}
