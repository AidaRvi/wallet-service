import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class CalculateTranactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  @Cron('0 0 * * *')
  async logDailyTransactions() {
    console.log('*** Daily transaction calculator is running...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const transactions = await this.transactionRepository.find({
      where: {
        createdAt: Between(today, tomorrow),
      },
    });

    const total = transactions.reduce(
      (
        total: { deposit: number; withdrawal: number },
        currentTransaction: Transaction,
      ) => {
        if (currentTransaction.action == 'deposit')
          total.deposit += currentTransaction.amount;
        else total.withdrawal += currentTransaction.amount;

        return total;
      },
      { deposit: 0, withdrawal: 0 },
    );

    console.log(
      `=> Total withdrawal transactions for "${today.toLocaleDateString()}" is "${total.withdrawal}"`,
    );
    console.log(
      `=> Total deposit transactions for "${today.toLocaleDateString()}" is "${total.deposit}"`,
    );
  }
}
