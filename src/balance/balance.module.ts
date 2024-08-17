import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { CalculateTranactionService } from './calculate-tranactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])],
  controllers: [BalanceController],
  providers: [BalanceService, CalculateTranactionService],
})
export class BalanceModule {}
