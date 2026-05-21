import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropietariosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.propietario.findMany();
  }

  // scaffolding
  findOne(id: number) { return `This action returns a #${id} propietario`; }
  async create(data: any) {
    return this.prisma.propietario.create({
      data: {
        nit_cui: data.nit_cui,
        nombres: data.nombres,
        apellidos: data.apellidos,
        direccion: data.direccion,
        fecha_nacimiento: new Date(data.fecha_nacimiento),
        usuario: {
          create: {
            username: data.username,
            password_hash: data.password,
            rol: 'PROPIETARIO'
          }
        }
      }
    });
  }
  update(id: number, data: any) { return `This action updates a #${id} propietario`; }
  remove(id: number) { return `This action removes a #${id} propietario`; }
}
