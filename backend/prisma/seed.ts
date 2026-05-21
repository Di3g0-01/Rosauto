import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/es';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el sembrado de datos (Seeding)...');

  // 1. Tipos de Uso
  const usos = ['Particular', 'Comercial', 'Alquiler', 'Transporte Público'];
  const tiposUsoMap = new Map<string, number>();
  for (const uso of usos) {
    const record = await prisma.tipo_uso.upsert({
      where: { nombre: uso },
      update: {},
      create: { nombre: uso },
    });
    tiposUsoMap.set(uso, record.id_tipo_uso);
  }

  // 2. Colores
  const colores = ['Blanco', 'Negro', 'Rojo', 'Azul', 'Plata', 'Gris', 'Verde', 'Amarillo'];
  const coloresMap = new Map<string, number>();
  for (const color of colores) {
    const record = await prisma.color.upsert({
      where: { nombre: color },
      update: {},
      create: { nombre: color },
    });
    coloresMap.set(color, record.id_color);
  }

  // 3. Marcas y Líneas
  const marcasData = {
    'Toyota': ['Corolla', 'Yaris', 'Hilux', 'RAV4'],
    'Honda': ['Civic', 'CR-V', 'Fit', 'HR-V'],
    'Ford': ['Ranger', 'Escape', 'Focus', 'Mustang'],
    'Nissan': ['Sentra', 'Versa', 'Frontier', 'Kicks'],
    'Mazda': ['Mazda3', 'CX-5', 'BT-50', 'Mazda2']
  };

  const lineasDisponibles = [];
  for (const [marcaNombre, lineas] of Object.entries(marcasData)) {
    const marcaRecord = await prisma.marca.upsert({
      where: { nombre: marcaNombre },
      update: {},
      create: { nombre: marcaNombre },
    });

    for (const lineaNombre of lineas) {
      // Because we don't have a unique constraint on linea_estilo.nombre, we use findFirst + create
      let lineaRecord = await prisma.linea_estilo.findFirst({
        where: { nombre: lineaNombre, id_marca: marcaRecord.id_marca }
      });
      if (!lineaRecord) {
        lineaRecord = await prisma.linea_estilo.create({
          data: { nombre: lineaNombre, id_marca: marcaRecord.id_marca }
        });
      }
      lineasDisponibles.push(lineaRecord.id_linea);
    }
  }

  // 4. Admin User
  const adminRole = 'ADMIN';
  await prisma.usuario.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: 'admin123', // En producción debería estar hasheada
      rol: adminRole,
    }
  });

  // 5. 100 Usuarios, Propietarios, Vehículos, Certificados y Tarjetas
  const numRecords = 100;
  console.log(`Generando ${numRecords} registros...`);

  for (let i = 0; i < numRecords; i++) {
    // Usuario
    const username = faker.internet.username() + i;
    const usuario = await prisma.usuario.create({
      data: {
        username: username.substring(0, 50),
        password_hash: faker.internet.password(),
        rol: 'PROPIETARIO',
      }
    });

    // Propietario
    const nit_cui = faker.string.numeric(13); // 13 digitos para CUI
    const propietario = await prisma.propietario.create({
      data: {
        nit_cui,
        nombres: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        direccion: faker.location.streetAddress(),
        fecha_nacimiento: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
        id_usuario: usuario.id_usuario
      }
    });

    // Vehículo
    const usoValues = Array.from(tiposUsoMap.values());
    const id_tipo_uso = faker.helpers.arrayElement(usoValues);
    const id_linea = faker.helpers.arrayElement(lineasDisponibles);
    
    // As in schema: "color" as string is required in vehiculo table, although id_color is in tarjeta_circulacion
    const colorStr = faker.helpers.arrayElement(colores); 

    const vehiculo = await prisma.vehiculo.create({
      data: {
        vin: faker.vehicle.vin().substring(0, 17),
        placa: faker.string.alphanumeric(7).toUpperCase(),
        num_motor: faker.string.alphanumeric(10).toUpperCase(),
        color: colorStr,
        cc: faker.number.int({ min: 1000, max: 4000 }),
        cilindros: faker.helpers.arrayElement([4, 6, 8]),
        asientos: faker.helpers.arrayElement([2, 4, 5, 7]),
        ejes: 2,
        tonelaje: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
        id_linea,
        id_tipo_uso,
        nit_cui: propietario.nit_cui,
        chasis: faker.string.alphanumeric(15).toUpperCase(),
        a_o_modelo: faker.number.int({ min: 1990, max: 2024 }),
      }
    });

    // Certificado
    const certificado = await prisma.certificado_propiedad.create({
      data: {
        id_vehiculo: vehiculo.id_vehiculo,
        fecha_emision: faker.date.past({ years: 5 }),
        activo: true,
      }
    });

    // Tarjeta de Circulación
    const numero_tarjeta = faker.string.numeric(10);
    const id_color = coloresMap.get(colorStr) || 1;
    
    await prisma.tarjeta_circulacion.create({
      data: {
        numero_tarjeta,
        id_vehiculo: vehiculo.id_vehiculo,
        id_certificado: certificado.id_certificado,
        fecha_emision: faker.date.past({ years: 2 }),
        estado: faker.helpers.arrayElement(['A', 'I']), // Activa o Inactiva
        nit_cui: propietario.nit_cui,
        id_tipo_uso,
        id_color,
        calcomania_pagada: faker.datatype.boolean()
      }
    });
  }

  console.log('Sembrado de datos finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error durante el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
