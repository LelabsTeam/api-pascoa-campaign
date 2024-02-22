import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
// eslint-disable-next-line import/no-cycle
import { EasterCoupon } from './EasterCoupon.model';

@Entity('easterUser')
@Unique(['email'])
export class EasterUser {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'varchar', unique: true })
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

  @OneToMany(() => EasterCoupon, (easterCoupon) => easterCoupon.user)
    coupons: EasterCoupon[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
