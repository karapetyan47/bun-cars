import type { Model, PrismaClient } from '@prisma/client';

class ModelRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async getModel(id: string): Promise<Model | null> {
    return this.prismaClient.model.findUnique({
      where: { id: Number(id) },
    });
  }
}

export default ModelRepository;
