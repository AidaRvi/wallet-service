import { Controller, Get, Body, Query, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { updateBalanceDTO } from './dto/update-balance.dto';
import { getBalanceDTO } from './dto/get-balance.dto';

@Controller('api/v1')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('/balance')
  async getBalance(
    @Query() query: getBalanceDTO,
  ): Promise<{ balance: number }> {
    const balance = await this.balanceService.getBalance(query.user_id);
    return { balance };
  }

  @Post('/money')
  async updateBalance(
    @Body() body: updateBalanceDTO,
  ): Promise<{ reference_id: string }> {
    const referenceId = await this.balanceService.updateBalance(
      body.user_id,
      body.amount,
    );
    return { reference_id: referenceId };
  }
}
