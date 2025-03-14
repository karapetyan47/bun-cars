import type { CarDetails, Prisma, PrismaClient } from '@prisma/client';

const omit = {
  id: true,
  carId: true,
};

class CarDetailsRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async createCarDetails(
    carDetails: Prisma.CarDetailsUncheckedCreateInput
  ): Promise<CarDetails> {
    return await this.prismaClient.carDetails.create({
      data: carDetails,
      omit: omit,
    });
  }

  async updateCarDetails(
    carId: number,
    carDetails: Prisma.CarDetailsUpdateInput
  ): Promise<CarDetails> {
    return await this.prismaClient.carDetails.update({
      where: { carId: Number(carId) },
      data: carDetails,
      omit: omit,
    });
  }
}

export default CarDetailsRepository;
