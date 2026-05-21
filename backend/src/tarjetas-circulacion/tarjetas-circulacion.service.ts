import { Injectable } from '@nestjs/common';
import { CreateTarjetasCirculacionDto } from './dto/create-tarjetas-circulacion.dto';
import { UpdateTarjetasCirculacionDto } from './dto/update-tarjetas-circulacion.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TarjetasCirculacionService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Basic validation and formatting for data
    const numero_tarjeta = Math.floor(Math.random() * 10000000000).toString();
    
    // Find first certificado for this vehiculo
    const certificado = await this.prisma.certificado_propiedad.findFirst({
      where: { id_vehiculo: parseInt(data.id_vehiculo) }
    });

    if (!certificado) {
      throw new Error('Vehículo no tiene certificado de propiedad');
    }

    return this.prisma.tarjeta_circulacion.create({
      data: {
        numero_tarjeta,
        id_vehiculo: parseInt(data.id_vehiculo),
        id_certificado: certificado.id_certificado,
        fecha_emision: new Date(),
        estado: 'A',
        nit_cui: data.nit_cui,
        id_tipo_uso: parseInt(data.id_tipo_uso),
        id_color: parseInt(data.id_color),
        calcomania_pagada: true,
      }
    });
  }

  async findAll() {
    return this.prisma.tarjeta_circulacion.findMany({
      include: {
        vehiculo: {
          include: {
            linea_estilo: {
              include: {
                marca: true
              }
            }
          }
        },
        propietario: true,
        color: true,
        tipo_uso: true,
      },
      orderBy: {
        fecha_emision: 'desc'
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.tarjeta_circulacion.findUnique({
      where: { numero_tarjeta: id },
      include: {
        vehiculo: {
          include: {
            linea_estilo: {
              include: {
                marca: true
              }
            }
          }
        },
        propietario: true,
        tramite: true,
        calcomania: true,
      }
    });
  }

  async deactivate(id: string, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Actualizar estado
      const tarjeta = await tx.tarjeta_circulacion.update({
        where: { numero_tarjeta: id },
        data: { estado: 'I' }
      });

      // 2. Registrar el trámite de desactivación
      await tx.tramite.create({
        data: {
          numero_tarjeta: id,
          tipo_tramite: 'Desactivación',
          descripcion: `Desactivada por: ${reason}`
        }
      });

      return tarjeta;
    });
  }

  async activate(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Actualizar estado
      const tarjeta = await tx.tarjeta_circulacion.update({
        where: { numero_tarjeta: id },
        data: { estado: 'A' }
      });

      // 2. Registrar el trámite de activación
      await tx.tramite.create({
        data: {
          numero_tarjeta: id,
          tipo_tramite: 'Activación',
          descripcion: `Activada desde el panel de control`
        }
      });

      return tarjeta;
    });
  }

  update(id: number, updateTarjetasCirculacionDto: UpdateTarjetasCirculacionDto) {
    return `This action updates a #${id} tarjetasCirculacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} tarjetasCirculacion`;
  }
}

