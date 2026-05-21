import { PartialType } from '@nestjs/mapped-types';
import { CreateTarjetasCirculacionDto } from './create-tarjetas-circulacion.dto';

export class UpdateTarjetasCirculacionDto extends PartialType(CreateTarjetasCirculacionDto) {}
