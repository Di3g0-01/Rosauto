import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TramitesService } from './tramites.service';

@Controller('tramites')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Post('traspaso')
  createTraspaso(@Body() data: { numero_tarjeta: string, nuevo_nit_cui: string, descripcion?: string }) {
    return this.tramitesService.createTraspaso(data);
  }

  @Post('cambio-motor')
  createCambioMotor(@Body() data: { numero_tarjeta: string, motor_nuevo: string, descripcion?: string }) {
    return this.tramitesService.createCambioMotor(data);
  }

  @Post('cambio-color')
  createCambioColor(@Body() data: { numero_tarjeta: string, nuevo_color: string, descripcion?: string }) {
    return this.tramitesService.createCambioColor(data);
  }

  @Post('cambio-chasis')
  createCambioChasis(@Body() data: { numero_tarjeta: string, chasis_nuevo: string, descripcion?: string }) {
    return this.tramitesService.createCambioChasis(data);
  }

  @Get()
  findAll() {
    return this.tramitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tramitesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tramitesService.remove(+id);
  }
}

