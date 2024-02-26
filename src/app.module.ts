import 'reflect-metadata';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './gateways/database/ormconfig';
import { PascoaModule } from './modules/pascoa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: process.env.ENVFILE || '.env.local', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => databaseConfig(process.env.ENVFILE === 'dev'),
    }),
    PascoaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
