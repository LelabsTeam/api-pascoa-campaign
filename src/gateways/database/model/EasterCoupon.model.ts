import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
// eslint-disable-next-line import/no-cycle
import { EasterUser } from './EasterUser.model';

@Entity('easterCoupon')
export class EasterCoupon {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'varchar', unique: true })
    user_id: string;

  // @Column({ type: 'varchar', unique: true })
  //   user_email: string;

  @ManyToOne(() => EasterUser, (easterUser) => easterUser.coupons)
    user: EasterUser;

  @Column({ type: 'int' })
    coupon_number: number;

  @CreateDateColumn({ name: 'redeemed_date' })
    redeemed_date: Date;

  @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
