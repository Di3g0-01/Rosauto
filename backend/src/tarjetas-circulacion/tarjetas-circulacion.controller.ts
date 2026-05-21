import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TarjetasCirculacionService } from './tarjetas-circulacion.service';
import { CreateTarjetasCirculacionDto } from './dto/create-tarjetas-circulacion.dto';
import { UpdateTarjetasCirculacionDto } from './dto/update-tarjetas-circulacion.dto';

@Controller('tarjetas-circulacion')
export class TarjetasCirculacionController {
  constructor(private readonly tarjetasCirculacionService: TarjetasCirculacionService) {}

  @Post()
  create(@Body() createTarjetasCirculacionDto: CreateTarjetasCirculacionDto) {
    return this.tarjetasCirculacionService.create(createTarjetasCirculacionDto);
  }

  @Get()
  findAll() {
    return this.tarjetasCirculacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tarjetasCirculacionService.findOne(id);
  }

  @Patch(':id/desactivar')
  deactivate(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.tarjetasCirculacionService.deactivate(id, body.reason);
  }

  @Patch(':id/activar')
  activate(@Param('id') id: string) {
    return this.tarjetasCirculacionService.activate(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTarjetasCirculacionDto: UpdateTarjetasCirculacionDto) {
    return this.tarjetasCirculacionService.update(+id, updateTarjetasCirculacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tarjetasCirculacionService.remove(+id);
  }
}

