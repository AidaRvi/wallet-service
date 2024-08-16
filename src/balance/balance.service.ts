import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // TODO: user not found
    return user.balance;
  }

  async updateBalance(userId: number, amount: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // user not found

    const transactionId = await this.createTransaction(amount);
    user.transactions.push(transactionId);
    const newBalance = user.balance + amount;

    await this.userRepository.update(
      { id: userId },
      { balance: newBalance, transactions: user.transactions },
    );

    return transactionId;
  }

  async createTransaction(amount: number): Promise<number> {
    const action = amount[0] == '-' ? 'withdrawal' : 'deposit';

    const transaction = this.transactionRepository.create({ amount, action });
    await this.transactionRepository.save(transaction);

    return transaction.id;
  }
}
