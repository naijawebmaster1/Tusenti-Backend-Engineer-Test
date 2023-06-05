import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Relation,
  RelationOptions,
} from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../utils/data-source';

const postRepository = AppDataSource.getRepository(Transaction);

export const createTransaction = async (input: Partial<Transaction>, user: User) => {
  return await postRepository.save(postRepository.create({ ...input, user }));
};

export const getTransaction = async (postId: string) => {
  return await postRepository.findOneBy({ id: postId });
};

export const findTransactions = async (
  where: FindOptionsWhere<Transaction> | undefined = {},
  select: FindOptionsSelect<Transaction> = {},
  relations: FindOptionsRelations<Transaction> = {}
) => {

  return await postRepository.find({
    where,
    select,
    relations,
  });
};
