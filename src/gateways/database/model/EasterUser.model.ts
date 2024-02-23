import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
// eslint-disable-next-line import/no-cycle
import { EasterCoupon } from './EasterCoupon.model';

@Entity('easterUser')
@Unique(['email'])
export class EasterUser {
  @Column({ type: 'varchar' })
    tenant_id: string;

  @PrimaryColumn({ type: 'varchar', unique: true })
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

  @OneToOne(() => EasterCoupon,  easterCoupon => easterCoupon.user, { nullable: true})
  @JoinColumn()
    coupon: EasterCoupon
}
