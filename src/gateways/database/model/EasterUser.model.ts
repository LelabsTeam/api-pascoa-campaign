import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { EasterCoupon } from './EasterCoupon.model';

@Entity('easteruser')
export class EasterUser {
  @PrimaryColumn({ type: 'varchar' })
    tenant_id: string;

  @PrimaryColumn({ type: 'varchar' })
    email: string;

  @Column({ type: 'boolean' })
    accepted_terms: boolean;

  @Column({ type: 'varchar' })
    cpf: string;

  @Column({ type: 'varchar' })
    phone: string;

  @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

  @OneToOne(() => EasterCoupon, (easterCoupon) => easterCoupon.user, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
    coupon: EasterCoupon;
}
