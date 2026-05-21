import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalcomaniasService {
  constructor(private prisma: PrismaService) {}

  async generate(data: { numero_tarjeta: string; anio?: number }) {
    const anio = data.anio || 2026;
    
    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar que exista la tarjeta
      const tarjeta = await tx.tarjeta_circulacion.findUnique({
        where: { numero_tarjeta: data.numero_tarjeta }
      });
      
      if (!tarjeta) {
        throw new Error('La tarjeta de circulación no existe');
      }

      // 2. Marcar calcomanía como pagada en la tarjeta
      await tx.tarjeta_circulacion.update({
        where: { numero_tarjeta: data.numero_tarjeta },
        data: { calcomania_pagada: true }
      });

      // 3. Crear o actualizar el registro de calcomanía
      const existing = await tx.calcomania.findFirst({
        where: {
          numero_tarjeta: data.numero_tarjeta,
          anio: anio
        }
      });

      if (existing) {
        return existing;
      }

      const vencimiento = new Date();
      vencimiento.setFullYear(vencimiento.getFullYear() + 1);

      return tx.calcomania.create({
        data: {
          numero_tarjeta: data.numero_tarjeta,
          anio: anio,
          fecha_pago: new Date(),
          estado: 'ACTIVO',
          monto_pagado: 150.00,
          fecha_vencimiento: vencimiento
        }
      });
    });
  }

  async findAll() {
    return this.prisma.calcomania.findMany({
      include: {
        tarjeta_circulacion: {
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
            tipo_uso: true
          }
        }
      },
      orderBy: {
        fecha_pago: 'desc'
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.calcomania.findUnique({
      where: { id_calcomania: id },
      include: {
        tarjeta_circulacion: {
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
            tipo_uso: true
          }
        }
      }
    });
  }
}
