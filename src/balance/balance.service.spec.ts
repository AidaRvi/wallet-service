import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { HttpException } from '@nestjs/common';

describe('BalanceService', () => {
  let balanceService: BalanceService;
  let userRepository: Repository<User>;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    balanceService = module.get<BalanceService>(BalanceService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(balanceService).toBeDefined();
  });

  it('should return balance', async () => {
    const user = new User();
    user.id = randomUUID();
    user.username = 'John';
    user.balance = 1000;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    expect(await balanceService.getBalance(user.id)).toBe(1000);
  });

  it('should throw bad request exeption if the user is not found in getting balance', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    await expect(balanceService.getBalance(randomUUID())).rejects.toThrow(
      HttpException,
    );
  });

  it('should throw an HttpException if another error occurs in getting balance', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
      throw new HttpException('Unexpected error', 500);
    });

    await expect(balanceService.getBalance(randomUUID())).rejects.toThrow(
      HttpException,
    );
  });

  it('should create a deposit transaction', async () => {
    const user = new User();
    user.id = randomUUID();
    user.username = 'John';
    user.balance = 1000;

    const amount = 100;

    const transaction = {
      id: randomUUID(),
      amount,
      action: 'deposit',
      user,
    } as Transaction;

    jest.spyOn(transactionRepository, 'create').mockReturnValue(transaction);
    jest.spyOn(transactionRepository, 'save').mockResolvedValue(transaction);

    const result = await balanceService.createTransaction(user, amount);

    expect(transactionRepository.create).toHaveBeenCalledWith({
      amount: Math.abs(amount),
      action: 'deposit',
      user,
    });
    expect(result).toEqual(transaction);
  });

  it('should create a withdrawal transaction', async () => {
    const user = new User();
    user.id = randomUUID();
    user.username = 'John';
    user.balance = 1000;

    const amount = -100;

    const transaction = {
      id: randomUUID(),
      amount: Math.abs(amount),
      action: 'withdrawal',
      user,
    } as Transaction;

    jest.spyOn(transactionRepository, 'create').mockReturnValue(transaction);
    jest.spyOn(transactionRepository, 'save').mockResolvedValue(transaction);

    const result = await balanceService.createTransaction(user, amount);

    expect(transactionRepository.create).toHaveBeenCalledWith({
      amount: Math.abs(amount),
      action: 'withdrawal',
      user,
    });
    expect(result).toEqual(transaction);
  });

  it("should add money to user's wallet and return the transactionId", async () => {
    const user = new User();
    user.id = randomUUID();
    user.username = 'John';
    user.balance = 1000;

    const amount = 500;

    const transaction = {
      id: randomUUID(),
      amount: Math.abs(amount),
      action: 'deposit',
      user,
    } as Transaction;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest
      .spyOn(balanceService, 'createTransaction')
      .mockResolvedValue(transaction);
    jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

    const referenceId = await balanceService.updateBalance(user.id, amount);
    expect(referenceId).toBeDefined();
    expect(referenceId).toBe(transaction.id);
    expect(user.balance).toBe(1500);
  });

  it("should subtract money from user's wallet and return the transactionId", async () => {
    const user = new User();
    user.id = randomUUID();
    user.username = 'John';
    user.balance = 1000;

    const amount = -200;

    const transaction = {
      id: randomUUID(),
      amount: Math.abs(amount),
      action: 'withdrawal',
      user,
    } as Transaction;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest
      .spyOn(balanceService, 'createTransaction')
      .mockResolvedValue(transaction);
    jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

    const referenceId = await balanceService.updateBalance(user.id, amount);
    expect(referenceId).toBeDefined();
    expect(referenceId).toBe(transaction.id);
    expect(user.balance).toBe(800);
  });

  it('should throw bad request exeption for existing user while updating the balance', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    await expect(
      balanceService.updateBalance(randomUUID(), 50),
    ).rejects.toThrow(HttpException);
  });
});
