import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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

  async getBalance(userId: string): Promise<number> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');
      return user.balance;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateBalance(userId: string, amount: number): Promise<string> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      const transaction = await this.createTransaction(user, amount);
      const newBalance = user.balance + amount;

      await this.userRepository.update({ id: userId }, { balance: newBalance });

      return transaction.id;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
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
