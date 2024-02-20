import { Module, Scope } from '@nestjs/common';

import { MasterDataService, PascoaService } from './services';
import { PascoaController } from './controllers/pascoa.controller';

@Module({
  imports: [],
  controllers: [PascoaController],
  providers: [PascoaService, MasterDataService],
})
export class AppModule {}
