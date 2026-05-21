import { Module } from '@nestjs/common';
import { TarjetasCirculacionService } from './tarjetas-circulacion.service';
import { TarjetasCirculacionController } from './tarjetas-circulacion.controller';

@Module({
  controllers: [TarjetasCirculacionController],
  providers: [TarjetasCirculacionService],
})
export class TarjetasCirculacionModule {}
