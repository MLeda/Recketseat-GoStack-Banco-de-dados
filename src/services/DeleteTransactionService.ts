import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const findTransaction = await transactionRepository.findOne(id);
    if (findTransaction) {
      await transactionRepository.remove(findTransaction);
    } else throw new AppError('Transaction not finded', 401);
  }
}

export default DeleteTransactionService;
