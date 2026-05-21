import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CalcomaniasService } from './calcomanias.service';

@Controller('calcomanias')
export class CalcomaniasController {
  constructor(private readonly calcomaniasService: CalcomaniasService) {}

  @Post('generar')
  generar(@Body() body: { numero_tarjeta: string; anio?: number }) {
    return this.calcomaniasService.generate(body);
  }

  @Get()
  findAll() {
    return this.calcomaniasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calcomaniasService.findOne(+id);
  }
}
