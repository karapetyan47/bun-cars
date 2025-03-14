import type { CarImage, Prisma, PrismaClient } from '@prisma/client';

class CarImageRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getCarImage(id: number): Promise<CarImage | null> {
    return await this.prismaClient.carImage.findUnique({
      where: { id: Number(id) },
    });
  }

  async getCarImages(carId: number): Promise<CarImage[]> {
    return await this.prismaClient.carImage.findMany({
      where: { carId: Number(carId) },
    });
  }

  async createCarImage(data: Prisma.CarImageCreateInput): Promise<CarImage> {
    return await this.prismaClient.carImage.create({
      data,
    });
  }

  async createCarImages(data: Prisma.CarImageCreateManyInput[]) {
    return await this.prismaClient.carImage.createMany({
      data,
    });
  }

  async updateCarImage(
    id: string,
    image: Prisma.CarImageUpdateInput
  ): Promise<CarImage> {
    return await this.prismaClient.carImage.update({
      where: { id: Number(id) },
      data: image,
    });
  }

  async deleteCarImage(id: number): Promise<CarImage> {
    return await this.prismaClient.carImage.delete({
      where: { id: Number(id) },
    });
  }

  async deleteCarImages(carId: number) {
    await this.prismaClient.carImage.deleteMany({
      where: { carId: Number(carId) },
    });
  }
}

export default CarImageRepository;
