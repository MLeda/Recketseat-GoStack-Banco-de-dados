import { Router } from 'express';
import multer from 'multer';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transationRepository = getCustomRepository(TransactionsRepository);
  const allTransactions = await transationRepository.find({
    relations: ['category_id'],
  });
  return response.json({
    transactions: allTransactions,
    balance: await transationRepository.getBalance(),
  });
});

transactionsRouter.post('/', async (request, response) => {
  const transationRepository = getCustomRepository(TransactionsRepository);
  const { title, type, value, category } = request.body;
  const createTransactioService = new CreateTransactionService();
  const balance = await transationRepository.getBalance();
  if (balance.total - value < 0 && type === 'outcome')
    throw new AppError('Balance can not be negative', 400);
  const newTransaction = await createTransactioService.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const transactionDeleteService = new DeleteTransactionService();
  const { id } = request.params;
  await transactionDeleteService.execute(id);
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const imporTransaction = new ImportTransactionsService();
    const transactions = await imporTransaction.execute(request.file.path);

    return response.json(transactions);
  },
);

export default transactionsRouter;
