import type { Model, PrismaClient } from '@prisma/client';

class ModelRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async getModel(id: number): Promise<Model | null> {
    return this.prismaClient.model.findUnique({
      where: { id },
    });
  }
}

export default ModelRepository;
