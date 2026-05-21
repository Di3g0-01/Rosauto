import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropietariosModule } from './propietarios/propietarios.module';
import { AuthService } from './auth/auth.service';
import { TarjetasCirculacionModule } from './tarjetas-circulacion/tarjetas-circulacion.module';
import { TramitesModule } from './tramites/tramites.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { CalcomaniasModule } from './calcomanias/calcomanias.module';

@Module({
  imports: [PrismaModule, PropietariosModule, TarjetasCirculacionModule, TramitesModule, VehiculosModule, CalcomaniasModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
