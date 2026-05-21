import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VehiculosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehiculo.findMany({
      include: {
        linea_estilo: {
          include: {
            marca: true
          }
        },
        tipo_uso: true,
        propietario: true,
        tarjeta_circulacion: {
          include: {
            color: true,
            tipo_uso: true,
            propietario: true,
            calcomania: true
          },
          orderBy: {
            fecha_emision: 'desc'
          }
        },
        historial_cambios: {
          orderBy: {
            fecha_cambio: 'desc'
          }
        }
      },
      orderBy: {
        id_vehiculo: 'desc'
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.vehiculo.findUnique({
      where: { id_vehiculo: id },
      include: {
        linea_estilo: {
          include: {
            marca: true
          }
        },
        tipo_uso: true,
        propietario: true,
        tarjeta_circulacion: {
          include: {
            color: true,
            tipo_uso: true,
            propietario: true,
            calcomania: true
          },
          orderBy: {
            fecha_emision: 'desc'
          }
        },
        historial_cambios: {
          orderBy: {
            fecha_cambio: 'desc'
          }
        }
      }
    });
  }

  async create(data: any) {
    return this.prisma.$transaction(async (tx) => {
      const { 
        placa, vin, num_motor, color, cc, cilindros, asientos, ejes, tonelaje, chasis, a_o_modelo,
        id_linea, id_tipo_uso, nit_cui, nuevo_marca_nombre, nuevo_linea_nombre
      } = data;

      let resolvedIdLinea = id_linea ? parseInt(id_linea) : undefined;

      if (nuevo_marca_nombre && nuevo_linea_nombre) {
        // Resolver o crear Marca
        const brandName = nuevo_marca_nombre.trim();
        let brandRecord = await tx.marca.findFirst({
          where: { nombre: { equals: brandName, mode: 'insensitive' } }
        });
        if (!brandRecord) {
          brandRecord = await tx.marca.create({ data: { nombre: brandName } });
        }

        // Resolver o crear Línea
        const lineName = nuevo_linea_nombre.trim();
        let lineRecord = await tx.linea_estilo.findFirst({
          where: { id_marca: brandRecord.id_marca, nombre: { equals: lineName, mode: 'insensitive' } }
        });
        if (!lineRecord) {
          lineRecord = await tx.linea_estilo.create({
            data: { nombre: lineName, id_marca: brandRecord.id_marca }
          });
        }
        resolvedIdLinea = lineRecord.id_linea;
      } else if (!resolvedIdLinea && data.id_marca && nuevo_linea_nombre) {
        const brandId = parseInt(data.id_marca);
        const lineName = nuevo_linea_nombre.trim();
        let lineRecord = await tx.linea_estilo.findFirst({
          where: { id_marca: brandId, nombre: { equals: lineName, mode: 'insensitive' } }
        });
        if (!lineRecord) {
          lineRecord = await tx.linea_estilo.create({
            data: { nombre: lineName, id_marca: brandId }
          });
        }
        resolvedIdLinea = lineRecord.id_linea;
      }

      if (!resolvedIdLinea) throw new BadRequestException("Debe especificar una línea o crear una nueva");
      if (!id_tipo_uso) throw new BadRequestException("Debe seleccionar un tipo de uso");

      const placaExistente = await tx.vehiculo.findUnique({
        where: { placa }
      });
      if (placaExistente) {
        throw new BadRequestException(`La placa ${placa} ya está registrada en el sistema.`);
      }

      const vehiculo = await tx.vehiculo.create({
        data: {
          placa,
          vin,
          num_motor,
          color,
          cc: parseInt(cc) || 0,
          cilindros: parseInt(cilindros) || 0,
          asientos: parseInt(asientos) || 0,
          ejes: parseInt(ejes) || 0,
          tonelaje: parseFloat(tonelaje) || 0,
          chasis,
          a_o_modelo: parseInt(a_o_modelo) || null,
          id_linea: resolvedIdLinea,
          id_tipo_uso: parseInt(id_tipo_uso),
          nit_cui
        }
      });

      // Crear tarjeta y certificado para el vehículo nuevo
      let colorRecord = await tx.color.findFirst({
        where: { nombre: { equals: color, mode: 'insensitive' } }
      });
      if (!colorRecord) {
        colorRecord = await tx.color.create({ data: { nombre: color } });
      }

      const certificado = await tx.certificado_propiedad.create({
        data: { id_vehiculo: vehiculo.id_vehiculo, fecha_emision: new Date(), activo: true }
      });

      const numero_tarjeta = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      await tx.tarjeta_circulacion.create({
        data: {
          numero_tarjeta,
          id_vehiculo: vehiculo.id_vehiculo,
          id_certificado: certificado.id_certificado,
          fecha_emision: new Date(),
          estado: 'A',
          nit_cui,
          id_tipo_uso: parseInt(id_tipo_uso),
          id_color: colorRecord.id_color,
          calcomania_pagada: true,
          
          placa: vehiculo.placa,
          num_motor: vehiculo.num_motor,
          vin: vehiculo.vin,
          chasis: vehiculo.chasis,
          asientos: vehiculo.asientos,
          ejes: vehiculo.ejes,
          cilindros: vehiculo.cilindros,
          cc: vehiculo.cc,
          tonelaje: vehiculo.tonelaje,
          a_o_modelo: vehiculo.a_o_modelo,
          id_linea: vehiculo.id_linea
        }
      });

      const vencimiento = new Date();
      vencimiento.setFullYear(vencimiento.getFullYear() + 1);

      await tx.calcomania.create({
        data: {
          numero_tarjeta,
          anio: 2026,
          fecha_pago: new Date(),
          estado: 'ACTIVO',
          monto_pagado: 150.00,
          fecha_vencimiento: vencimiento
        }
      });

      return vehiculo;
    });
  }

  async update(id: number, data: any) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Obtener estado actual del vehículo con relaciones para comparar
      const vehiculoActual = await tx.vehiculo.findUnique({
        where: { id_vehiculo: id },
        include: {
          linea_estilo: {
            include: {
              marca: true
            }
          },
          tipo_uso: true,
          propietario: true
        }
      });

      if (!vehiculoActual) {
        throw new Error('Vehículo no encontrado');
      }

      // Preparar los datos técnicos para el update del vehiculo
      const { 
        placa, vin, num_motor, color, cc, cilindros, asientos, ejes, tonelaje, chasis, a_o_modelo,
        id_linea, id_tipo_uso, nit_cui, nuevo_marca_nombre, nuevo_linea_nombre
      } = data;
      if (placa !== undefined && placa !== vehiculoActual.placa) {
        const placaExistente = await tx.vehiculo.findUnique({
          where: { placa }
        });
        if (placaExistente) {
          throw new BadRequestException(`La placa ${placa} ya está registrada en otro vehículo del sistema.`);
        }
      }

      const updateData: any = {};
      if (placa !== undefined) updateData.placa = placa;
      if (vin !== undefined) updateData.vin = vin;
      if (num_motor !== undefined) updateData.num_motor = num_motor;
      if (color !== undefined) updateData.color = color;
      if (cc !== undefined) updateData.cc = parseInt(cc) || 0;
      if (cilindros !== undefined) updateData.cilindros = parseInt(cilindros) || 0;
      if (asientos !== undefined) updateData.asientos = parseInt(asientos) || 0;
      if (ejes !== undefined) updateData.ejes = parseInt(ejes) || 0;
      if (tonelaje !== undefined) updateData.tonelaje = parseFloat(tonelaje) || 0;
      if (chasis !== undefined) updateData.chasis = chasis;
      if (a_o_modelo !== undefined) updateData.a_o_modelo = parseInt(a_o_modelo) || null;
      if (id_linea !== undefined) updateData.id_linea = parseInt(id_linea);
      if (id_tipo_uso !== undefined) updateData.id_tipo_uso = parseInt(id_tipo_uso);
      if (nit_cui !== undefined) updateData.nit_cui = nit_cui;

      let resolvedIdLinea = id_linea !== undefined ? parseInt(id_linea) : undefined;

      if (nuevo_marca_nombre && nuevo_linea_nombre) {
        // 1. Resolver o crear Marca
        const brandName = nuevo_marca_nombre.trim();
        let brandRecord = await tx.marca.findFirst({
          where: { nombre: { equals: brandName, mode: 'insensitive' } }
        });
        if (!brandRecord) {
          brandRecord = await tx.marca.create({
            data: { nombre: brandName }
          });
        }

        // 2. Resolver o crear Línea bajo esa Marca
        const lineName = nuevo_linea_nombre.trim();
        let lineRecord = await tx.linea_estilo.findFirst({
          where: {
            id_marca: brandRecord.id_marca,
            nombre: { equals: lineName, mode: 'insensitive' }
          }
        });
        if (!lineRecord) {
          lineRecord = await tx.linea_estilo.create({
            data: {
              nombre: lineName,
              id_marca: brandRecord.id_marca
            }
          });
        }

        resolvedIdLinea = lineRecord.id_linea;
        updateData.id_linea = resolvedIdLinea;
      }

      // 2. Comparar campos para generar bitácora de cambios
      const cambiosDesc: string[] = [];

      const checkChange = (label: string, oldVal: any, newVal: any) => {
        if (newVal !== undefined && String(oldVal) !== String(newVal)) {
          cambiosDesc.push(`${label}: "${oldVal || 'N/A'}" ➔ "${newVal || 'N/A'}"`);
        }
      };

      checkChange('Placa', vehiculoActual.placa, placa);
      checkChange('VIN', vehiculoActual.vin, vin);
      checkChange('Número de Motor', vehiculoActual.num_motor, num_motor);
      checkChange('Chasis', vehiculoActual.chasis, chasis);
      checkChange('Color', vehiculoActual.color, color);
      checkChange('Cilindraje (CC)', vehiculoActual.cc, cc);
      checkChange('Cilindros', vehiculoActual.cilindros, cilindros);
      checkChange('Asientos', vehiculoActual.asientos, asientos);
      checkChange('Ejes', vehiculoActual.ejes, ejes);
      checkChange('Tonelaje', vehiculoActual.tonelaje, tonelaje);
      checkChange('Modelo (Año)', vehiculoActual.a_o_modelo, a_o_modelo);

      // Comparaciones de relaciones complejas para la bitácora
      const finalIdLinea = resolvedIdLinea !== undefined ? resolvedIdLinea : vehiculoActual.id_linea;
      if (finalIdLinea !== vehiculoActual.id_linea) {
        const nuevaLinea = await tx.linea_estilo.findUnique({
          where: { id_linea: finalIdLinea },
          include: { marca: true }
        });
        if (nuevaLinea) {
          cambiosDesc.push(`Marca/Línea: "${vehiculoActual.linea_estilo?.marca?.nombre} ${vehiculoActual.linea_estilo?.nombre}" ➔ "${nuevaLinea.marca?.nombre} ${nuevaLinea.nombre}"`);
        }
      }

      if (id_tipo_uso !== undefined && parseInt(id_tipo_uso) !== vehiculoActual.id_tipo_uso) {
        const nuevoUso = await tx.tipo_uso.findUnique({
          where: { id_tipo_uso: parseInt(id_tipo_uso) }
        });
        if (nuevoUso) {
          cambiosDesc.push(`Tipo de Uso: "${vehiculoActual.tipo_uso?.nombre}" ➔ "${nuevoUso.nombre}"`);
        }
      }

      if (nit_cui !== undefined && nit_cui !== vehiculoActual.nit_cui) {
        const nuevoProp = await tx.propietario.findUnique({
          where: { nit_cui: nit_cui }
        });
        if (nuevoProp) {
          cambiosDesc.push(`Propietario: "${vehiculoActual.propietario?.nombres} ${vehiculoActual.propietario?.apellidos} (${vehiculoActual.nit_cui})" ➔ "${nuevoProp.nombres} ${nuevoProp.apellidos} (${nuevoProp.nit_cui})"`);
        }
      }

      const hayCambios = cambiosDesc.length > 0;

      // 3. Realizar el update del vehículo en BD
      const vehiculoActualizado = await tx.vehiculo.update({
        where: { id_vehiculo: id },
        data: updateData,
        include: {
          linea_estilo: {
            include: {
              marca: true
            }
          },
          tipo_uso: true,
          propietario: true
        }
      });

      if (hayCambios) {
        // 4. Buscar o crear el color en la tabla `color`
        const colorNombre = color || vehiculoActual.color;
        let colorRecord = await tx.color.findFirst({
          where: { nombre: { equals: colorNombre, mode: 'insensitive' } }
        });
        if (!colorRecord) {
          colorRecord = await tx.color.create({
            data: { nombre: colorNombre }
          });
        }

        // 5. Desactivar todas las tarjetas de circulación activas previas de este vehículo y sus calcomanías
        const tarjetasPrevias = await tx.tarjeta_circulacion.findMany({
          where: { id_vehiculo: id, estado: 'A' },
          select: { numero_tarjeta: true }
        });

        const numerosTarjetasPrevias = tarjetasPrevias.map(t => t.numero_tarjeta);

        if (numerosTarjetasPrevias.length > 0) {
          await tx.calcomania.updateMany({
            where: { numero_tarjeta: { in: numerosTarjetasPrevias }, estado: 'ACTIVO' },
            data: { estado: 'INACTIVO' }
          });

          await tx.tarjeta_circulacion.updateMany({
            where: { numero_tarjeta: { in: numerosTarjetasPrevias } },
            data: { estado: 'I' }
          });
        }

        // 6. Obtener o crear certificado de propiedad si no existe
        let certificado = await tx.certificado_propiedad.findFirst({
          where: { id_vehiculo: id }
        });
        if (!certificado) {
          certificado = await tx.certificado_propiedad.create({
            data: {
              id_vehiculo: id,
              fecha_emision: new Date(),
              activo: true
            }
          });
        }

        // 7. Crear la nueva tarjeta de circulación
        const numero_tarjeta = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        await tx.tarjeta_circulacion.create({
          data: {
            numero_tarjeta,
            id_vehiculo: id,
            id_certificado: certificado.id_certificado,
            fecha_emision: new Date(),
            estado: 'A',
            nit_cui: nit_cui || vehiculoActualizado.nit_cui,
            id_tipo_uso: id_tipo_uso ? parseInt(id_tipo_uso) : vehiculoActualizado.id_tipo_uso,
            id_color: colorRecord.id_color,
            calcomania_pagada: true,

            placa: vehiculoActualizado.placa,
            num_motor: vehiculoActualizado.num_motor,
            vin: vehiculoActualizado.vin,
            chasis: vehiculoActualizado.chasis,
            asientos: vehiculoActualizado.asientos,
            ejes: vehiculoActualizado.ejes,
            cilindros: vehiculoActualizado.cilindros,
            cc: vehiculoActualizado.cc,
            tonelaje: vehiculoActualizado.tonelaje,
            a_o_modelo: vehiculoActualizado.a_o_modelo,
            id_linea: vehiculoActualizado.id_linea
          }
        });

        const vencimiento = new Date();
        vencimiento.setFullYear(vencimiento.getFullYear() + 1);

        await tx.calcomania.create({
          data: {
            numero_tarjeta,
            anio: 2026,
            fecha_pago: new Date(),
            estado: 'ACTIVO',
            monto_pagado: 150.00,
            fecha_vencimiento: vencimiento
          }
        });

        // 8. Registrar los cambios en el historial_cambios
        const descripcionCambios = cambiosDesc.join(', ');
        await tx.historial_cambios.create({
          data: {
            id_vehiculo: id,
            descripcion: descripcionCambios
          }
        });
      }

      return vehiculoActualizado;
    });
  }

  async remove(id: number) {
    return this.prisma.vehiculo.delete({
      where: { id_vehiculo: id }
    });
  }

  async getMetadata() {
    const marcas = await this.prisma.marca.findMany({
      include: {
        linea_estilo: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    const tiposUso = await this.prisma.tipo_uso.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });

    const propietarios = await this.prisma.propietario.findMany({
      orderBy: {
        apellidos: 'asc'
      }
    });

    return { marcas, tiposUso, propietarios };
  }
}
