import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { EasterUser } from './EasterUser.model';

@Entity('easterCoupon')
export class EasterCoupon {
  @Column({ type: 'varchar' })
    tenant_id: string;

  @Column({ type: 'varchar', unique: false, nullable: true })
    user_email: string;

  @OneToOne(() => EasterUser, (easerUser) => easerUser.coupon, { nullable: true })
    user: EasterUser;

  @PrimaryColumn({ type: 'varchar' })
    coupon_number: string;

  @Column({ type: 'date', nullable: true })
    redeemed_date: string;

  @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
