import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PascoaController } from 'src/controllers/pascoa.controller';
import { StorageRepository } from 'src/repositories/storage.repository';
import { PascoaService } from 'src/services/pascoa.service';
import { EasterCoupon } from '../gateways/database/model/EasterCoupon.model';
import { EasterUser } from '../gateways/database/model/EasterUser.model';
import { cacheGateway } from '../gateways/database/cache-gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([EasterUser]),
    TypeOrmModule.forFeature([EasterCoupon]),
  ],
  controllers: [
    PascoaController,
  ],
  providers: [
    {
      provide: 'IStorageRepository',
      useClass: StorageRepository,
    },
    ...cacheGateway,
    PascoaService,
  ],
})
export class PascoaModule {}
