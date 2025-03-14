import type { PrismaClient, Type } from '@prisma/client';

class TypeRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getType(id: number): Promise<Type | null> {
    return this.prismaClient.type.findUnique({
      where: { id },
    });
  }
}

export default TypeRepository;
