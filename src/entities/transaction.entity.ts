import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';

export enum TransactionEnumType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

@Entity('transaction')
export class Transaction extends Model {

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionEnumType,
  })
  transaction_type: TransactionEnumType;

  @ManyToOne(() => User, (user) => user.transaction)
  @JoinColumn()
  user: User;
}
