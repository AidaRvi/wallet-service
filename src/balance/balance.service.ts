import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // TODO: user not found
    return user.balance;
  }
}
