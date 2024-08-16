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
    return user.balance;
  }

  async updateBalance(userId: number, amount: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const transaction = await this.createTransaction(user, amount);
    const newBalance = user.balance + amount;

    await this.userRepository.update({ id: userId }, { balance: newBalance });

    return transaction.id;
  }

  async createTransaction(user: User, amount: number): Promise<Transaction> {
    const action = amount[0] == '-' ? 'withdrawal' : 'deposit';

    const transaction = this.transactionRepository.create({
      amount: Math.abs(amount),
      action,
      user,
    });
    await this.transactionRepository.save(transaction);

    return transaction;
  }
}
