import {
  MigrationInterface, QueryRunner, Table, TableForeignKey,
} from 'typeorm';

export class EasterCoupon1708574353782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'easterCoupon',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'coupon_number',
            type: 'int',
          },
          {
            name: 'redeemed_date',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys(
      'easterCoupon',
      [
        new TableForeignKey({
          name: 'EasterUserCouponById',
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'easterUser',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
        // new TableForeignKey({
        //   name: 'EasterUserCouponByEmail',
        //   columnNames: ['user_email'],
        //   referencedColumnNames: ['email'],
        //   referencedTableName: 'easterUser',
        //   onDelete: 'SET NULL',
        //   onUpdate: 'CASCADE',
        // }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('easterCoupon', 'EasterUserCouponById');
    // await queryRunner.dropForeignKey('easterCoupon', 'EasterUserCouponByEmail');
    await queryRunner.dropTable('easterCoupon');
  }
}
