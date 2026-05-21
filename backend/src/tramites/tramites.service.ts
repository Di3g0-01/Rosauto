import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TramitesService {
  constructor(private prisma: PrismaService) {}

  async createTraspaso(data: { numero_tarjeta: string, nuevo_nit_cui: string, descripcion?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const tarjeta = await tx.tarjeta_circulacion.findUnique({
        where: { numero_tarjeta: data.numero_tarjeta },
        include: { vehiculo: true }
      });
      if (!tarjeta) throw new Error('Tarjeta no encontrada');

      // 1. Desactivar tarjeta actual
      await tx.tarjeta_circulacion.update({
        where: { numero_tarjeta: data.numero_tarjeta },
        data: { estado: 'I' }
      });

      // 2. Emitir nueva tarjeta
      const numero_tarjeta_nuevo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      await tx.tarjeta_circulacion.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          id_vehiculo: tarjeta.id_vehiculo,
          id_certificado: tarjeta.id_certificado,
          fecha_emision: new Date(),
          estado: 'A',
          nit_cui: data.nuevo_nit_cui,
          id_tipo_uso: tarjeta.id_tipo_uso,
          id_color: tarjeta.id_color,
          calcomania_pagada: true,
          
          placa: tarjeta.vehiculo.placa,
          num_motor: tarjeta.vehiculo.num_motor,
          vin: tarjeta.vehiculo.vin,
          chasis: tarjeta.vehiculo.chasis,
          asientos: tarjeta.vehiculo.asientos,
          ejes: tarjeta.vehiculo.ejes,
          cilindros: tarjeta.vehiculo.cilindros,
          cc: tarjeta.vehiculo.cc,
          tonelaje: tarjeta.vehiculo.tonelaje,
          a_o_modelo: tarjeta.vehiculo.a_o_modelo,
          id_linea: tarjeta.vehiculo.id_linea
        }
      });

      // 3. Generar calcomanía nueva
      const vencimiento = new Date();
      vencimiento.setFullYear(vencimiento.getFullYear() + 1);
      await tx.calcomania.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          anio: new Date().getFullYear(),
          fecha_pago: new Date(),
          estado: 'ACTIVO',
          monto_pagado: 150.00,
          fecha_vencimiento: vencimiento
        }
      });

      // 4. Actualizar vehículo
      await tx.vehiculo.update({
        where: { id_vehiculo: tarjeta.id_vehiculo },
        data: { nit_cui: data.nuevo_nit_cui }
      });

      // 5. Registrar trámite
      return tx.tramite.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          tipo_tramite: 'Traspaso (Cambio de Dueño)',
          descripcion: data.descripcion || `Traspaso a nuevo propietario con NIT/CUI: ${data.nuevo_nit_cui}`
        }
      });
    });
  }

  async createCambioMotor(data: { numero_tarjeta: string, motor_nuevo: string, descripcion?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const tarjeta = await tx.tarjeta_circulacion.findUnique({
        where: { numero_tarjeta: data.numero_tarjeta },
        include: { vehiculo: true }
      });
      if (!tarjeta) throw new Error('Tarjeta no encontrada');

      const motorAnterior = tarjeta.vehiculo.num_motor;

      // 1. Actualizar motor en Vehículo
      await tx.vehiculo.update({
        where: { id_vehiculo: tarjeta.id_vehiculo },
        data: { num_motor: data.motor_nuevo }
      });

      // 2. Registrar en Historial de Motor
      await tx.historial_motor.create({
        data: {
          id_vehiculo: tarjeta.id_vehiculo,
          motor_anterior: motorAnterior,
          motor_nuevo: data.motor_nuevo
        }
      });

      // 3. Desactivar tarjeta antigua
      await tx.tarjeta_circulacion.update({
        where: { numero_tarjeta: data.numero_tarjeta },
        data: { estado: 'I' }
      });

      // 4. Emitir nueva tarjeta
      const numero_tarjeta_nuevo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      await tx.tarjeta_circulacion.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          id_vehiculo: tarjeta.id_vehiculo,
          id_certificado: tarjeta.id_certificado,
          fecha_emision: new Date(),
          estado: 'A',
          nit_cui: tarjeta.nit_cui,
          id_tipo_uso: tarjeta.id_tipo_uso,
          id_color: tarjeta.id_color,
          calcomania_pagada: true,

          placa: tarjeta.vehiculo.placa,
          num_motor: data.motor_nuevo, // UPDATED FIELD
          vin: tarjeta.vehiculo.vin,
          chasis: tarjeta.vehiculo.chasis,
          asientos: tarjeta.vehiculo.asientos,
          ejes: tarjeta.vehiculo.ejes,
          cilindros: tarjeta.vehiculo.cilindros,
          cc: tarjeta.vehiculo.cc,
          tonelaje: tarjeta.vehiculo.tonelaje,
          a_o_modelo: tarjeta.vehiculo.a_o_modelo,
          id_linea: tarjeta.vehiculo.id_linea
        }
      });

      // 5. Generar calcomanía nueva
      const vencimiento = new Date();
      vencimiento.setFullYear(vencimiento.getFullYear() + 1);
      await tx.calcomania.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          anio: new Date().getFullYear(),
          fecha_pago: new Date(),
          estado: 'ACTIVO',
          monto_pagado: 150.00,
          fecha_vencimiento: vencimiento
        }
      });

      // 6. Registrar Trámite
      return tx.tramite.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          tipo_tramite: 'Cambio de Motor',
          descripcion: data.descripcion || `Cambio de motor: ${motorAnterior} -> ${data.motor_nuevo}`
        }
      });
    });
  }

  async createCambioColor(data: { numero_tarjeta: string, nuevo_color: string, descripcion?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const tarjeta = await tx.tarjeta_circulacion.findUnique({
        where: { numero_tarjeta: data.numero_tarjeta },
        include: { vehiculo: true, color: true }
      });
      if (!tarjeta) throw new Error('Tarjeta no encontrada');

      const upperColorName = data.nuevo_color.trim().toUpperCase();

      // Find or create color
      let colorNuevo = await tx.color.findFirst({
        where: {
          nombre: {
            equals: upperColorName,
            mode: 'insensitive' // Requires Prisma to have this mode, or just exact match with uppercase
          }
        }
      });

      if (!colorNuevo) {
        colorNuevo = await tx.color.create({
          data: { nombre: upperColorName }
        });
      }

      // 1. Actualizar color en Vehículo (string)
      await tx.vehiculo.update({
        where: { id_vehiculo: tarjeta.id_vehiculo },
        data: { color: colorNuevo.nombre }
      });

      // 2. Desactivar tarjeta antigua
      await tx.tarjeta_circulacion.update({
        where: { numero_tarjeta: data.numero_tarjeta },
        data: { estado: 'I' }
      });

      // 3. Emitir nueva tarjeta
      const numero_tarjeta_nuevo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      await tx.tarjeta_circulacion.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          id_vehiculo: tarjeta.id_vehiculo,
          id_certificado: tarjeta.id_certificado,
          fecha_emision: new Date(),
          estado: 'A',
          nit_cui: tarjeta.nit_cui,
          id_tipo_uso: tarjeta.id_tipo_uso,
          id_color: colorNuevo.id_color,
          calcomania_pagada: true,

          placa: tarjeta.vehiculo.placa,
          num_motor: tarjeta.vehiculo.num_motor,
          vin: tarjeta.vehiculo.vin,
          chasis: tarjeta.vehiculo.chasis,
          asientos: tarjeta.vehiculo.asientos,
          ejes: tarjeta.vehiculo.ejes,
          cilindros: tarjeta.vehiculo.cilindros,
          cc: tarjeta.vehiculo.cc,
          tonelaje: tarjeta.vehiculo.tonelaje,
          a_o_modelo: tarjeta.vehiculo.a_o_modelo,
          id_linea: tarjeta.vehiculo.id_linea
        }
      });

      // 4. Generar calcomanía nueva
      const vencimiento = new Date();
      vencimiento.setFullYear(vencimiento.getFullYear() + 1);
      await tx.calcomania.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          anio: new Date().getFullYear(),
          fecha_pago: new Date(),
          estado: 'ACTIVO',
          monto_pagado: 150.00,
          fecha_vencimiento: vencimiento
        }
      });

      // 5. Registrar Trámite
      return tx.tramite.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          tipo_tramite: 'Cambio de Color',
          descripcion: data.descripcion || `Cambio de color: ${tarjeta.color?.nombre || 'Desconocido'} -> ${colorNuevo.nombre}`
        }
      });
    });
  }

  async createCambioChasis(data: { numero_tarjeta: string, chasis_nuevo: string, descripcion?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const tarjeta = await tx.tarjeta_circulacion.findUnique({
        where: { numero_tarjeta: data.numero_tarjeta },
        include: { vehiculo: true }
      });
      if (!tarjeta) throw new Error('Tarjeta no encontrada');

      const chasisAnterior = tarjeta.vehiculo.chasis || 'N/A';

      // 1. Actualizar chasis en Vehículo
      await tx.vehiculo.update({
        where: { id_vehiculo: tarjeta.id_vehiculo },
        data: { chasis: data.chasis_nuevo }
      });

      // 2. Desactivar tarjeta antigua
      await tx.tarjeta_circulacion.update({
        where: { numero_tarjeta: data.numero_tarjeta },
        data: { estado: 'I' }
      });

      // 3. Emitir nueva tarjeta
      const numero_tarjeta_nuevo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      await tx.tarjeta_circulacion.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          id_vehiculo: tarjeta.id_vehiculo,
          id_certificado: tarjeta.id_certificado,
          fecha_emision: new Date(),
          estado: 'A',
          nit_cui: tarjeta.nit_cui,
          id_tipo_uso: tarjeta.id_tipo_uso,
          id_color: tarjeta.id_color,
          calcomania_pagada: true,

          placa: tarjeta.vehiculo.placa,
          num_motor: tarjeta.vehiculo.num_motor,
          vin: tarjeta.vehiculo.vin,
          chasis: data.chasis_nuevo, // UPDATED FIELD
          asientos: tarjeta.vehiculo.asientos,
          ejes: tarjeta.vehiculo.ejes,
          cilindros: tarjeta.vehiculo.cilindros,
          cc: tarjeta.vehiculo.cc,
          tonelaje: tarjeta.vehiculo.tonelaje,
          a_o_modelo: tarjeta.vehiculo.a_o_modelo,
          id_linea: tarjeta.vehiculo.id_linea
        }
      });

      // 4. Generar calcomanía nueva (1 año de vigencia)
      const vencimiento = new Date();
      vencimiento.setFullYear(vencimiento.getFullYear() + 1);
      await tx.calcomania.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          anio: new Date().getFullYear(),
          fecha_pago: new Date(),
          estado: 'ACTIVO',
          monto_pagado: 150.00,
          fecha_vencimiento: vencimiento
        }
      });

      // 5. Registrar bitácora de cambio técnico
      await tx.historial_cambios.create({
        data: {
          id_vehiculo: tarjeta.id_vehiculo,
          descripcion: `Chasis: "${chasisAnterior}" ➔ "${data.chasis_nuevo}"`
        }
      });

      // 6. Registrar Trámite
      return tx.tramite.create({
        data: {
          numero_tarjeta: numero_tarjeta_nuevo,
          tipo_tramite: 'Cambio de Chasis',
          descripcion: data.descripcion || `Cambio de chasis: ${chasisAnterior} -> ${data.chasis_nuevo}`
        }
      });
    });
  }

  findAll() {
    return this.prisma.tramite.findMany({
      include: {
        tarjeta_circulacion: {
          include: {
            vehiculo: true,
            propietario: true
          }
        }
      },
      orderBy: { fecha_tramite: 'desc' }
    });
  }

  findOne(id: number) { return `This action returns a #${id} tramite`; }
  remove(id: number) { return `This action removes a #${id} tramite`; }
}
