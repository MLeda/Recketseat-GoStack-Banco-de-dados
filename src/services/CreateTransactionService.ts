// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    category,
    type,
    value,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);
    let categoryid;
    const findCategory = await categoryRepository.findOne({
      where: { title: category },
    });
    if (!findCategory) {
      const newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
      categoryid = newCategory.id;
    } else categoryid = findCategory.id;

    const newTransaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryid,
    });

    transactionRepository.save(newTransaction);
    return newTransaction;
  }
}

export default CreateTransactionService;
