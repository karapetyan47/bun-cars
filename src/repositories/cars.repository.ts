import type { Car, Prisma, PrismaClient } from '@prisma/client';

const carReferances = {
  omit: {
    manufacturerId: true,
    typeId: true,
    modelId: true,
  },
  include: {
    details: {
      omit: {
        id: true,
        carId: true,
      },
    },
    images: {
      omit: {
        id: true,
        carId: true,
      },
    },
    model: {
      select: {
        id: true,
        name: true,
      },
    },
    manufacturer: {
      select: {
        id: true,
        name: true,
      },
    },
    type: {
      select: {
        id: true,
        name: true,
      },
    },
  },
};

class CarRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async getCars(): Promise<Car[]> {
    return await this.prismaClient.car.findMany({
      ...carReferances,
    });
  }

  async getCar(id: number): Promise<Car | null> {
    return await this.prismaClient.car.findUnique({
      where: { id: Number(id) },
      ...carReferances,
    });
  }

  async getUserCarsWithDetails(userId: number): Promise<Car[]> {
    return await this.prismaClient.car.findMany({
      where: { userId: Number(userId) },
      ...carReferances,
    });
  }

  async getCarsWithDetails(): Promise<Car[]> {
    return await this.prismaClient.car.findMany({
      ...carReferances,
    });
  }

  async getCarWithDetails(id: number): Promise<Car | null> {
    return await this.prismaClient.car.findUnique({
      where: { id: Number(id) },
      ...carReferances,
    });
  }

  async createCar(data: Prisma.CarUncheckedCreateInput): Promise<Car> {
    return await this.prismaClient.car.create({
      data,
      ...carReferances,
    });
  }

  async updateCar(id: number, data: Prisma.CarUpdateInput): Promise<Car> {
    return await this.prismaClient.car.update({
      where: { id: Number(id) },
      data,
      ...carReferances,
    });
  }

  async deleteCar(id: number): Promise<Car> {
    return await this.prismaClient.car.delete({ where: { id: Number(id) } });
  }
}

export default CarRepository;
