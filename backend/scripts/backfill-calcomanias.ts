import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando backfill de calcomanías...');

  // Obtener todas las tarjetas de circulación que no tienen calcomanía
  const tarjetas = await prisma.tarjeta_circulacion.findMany({
    include: {
      calcomania: true
    }
  });

  let creadas = 0;

  for (const tarjeta of tarjetas) {
    if (tarjeta.calcomania.length === 0) {
      const fechaPago = new Date(tarjeta.fecha_emision);
      const vencimiento = new Date(tarjeta.fecha_emision);
      vencimiento.setFullYear(vencimiento.getFullYear() + 1);

      await prisma.calcomania.create({
        data: {
          numero_tarjeta: tarjeta.numero_tarjeta,
          anio: fechaPago.getFullYear(),
          fecha_pago: fechaPago,
          estado: 'ACTIVO',
          monto_pagado: 150.00,
          fecha_vencimiento: vencimiento
        }
      });
      
      // Asegurar que la tarjeta diga que está pagada
      await prisma.tarjeta_circulacion.update({
        where: { numero_tarjeta: tarjeta.numero_tarjeta },
        data: { calcomania_pagada: true }
      });

      creadas++;
      console.log(`Calcomanía creada para tarjeta ${tarjeta.numero_tarjeta}`);
    } else {
      // Si ya tiene calcomania, vamos a asegurarnos que la fecha de vencimiento sea de 1 año
      for (const calc of tarjeta.calcomania) {
        const fechaCreacion = calc.fecha_pago || tarjeta.fecha_emision;
        const newVencimiento = new Date(fechaCreacion);
        newVencimiento.setFullYear(newVencimiento.getFullYear() + 1);
        
        await prisma.calcomania.update({
          where: { id_calcomania: calc.id_calcomania },
          data: { fecha_vencimiento: newVencimiento }
        });
      }
    }
  }

  console.log(`Proceso finalizado. Se crearon ${creadas} calcomanías nuevas y se actualizó el vencimiento de las existentes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
