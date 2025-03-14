import type { Manufacturer, PrismaClient } from '@prisma/client';

class ManufacturerRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getManufacturer(id: number): Promise<Manufacturer | null> {
    return this.prismaClient.manufacturer.findUnique({
      where: { id },
    });
  }
}

export default ManufacturerRepository;
