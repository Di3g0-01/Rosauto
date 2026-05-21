import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.log('Prisma connecting to database...');
    await this.$connect();
    console.log('Prisma connected successfully.');
  }
}
