import { Module } from '@nestjs/common';
import { CalcomaniasService } from './calcomanias.service';
import { CalcomaniasController } from './calcomanias.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CalcomaniasController],
  providers: [CalcomaniasService],
  exports: [CalcomaniasService]
})
export class CalcomaniasModule {}
