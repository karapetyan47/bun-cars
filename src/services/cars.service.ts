import Aws3Instance from '@/core/lib/aws3';
import { carSchema, carDetailsSchema } from '@/core/schemas/car.shema';
import type CarDetailsRepository from '@/repositories/carDetails.repository';
import type CarImageRepository from '@/repositories/carImage.repository';
import type CarRepository from '@/repositories/cars.repository';
import type { Car, CarDetails, CarImage, Prisma } from '@prisma/client';

class CarsService {
  constructor(
    private readonly carsRepository: CarRepository,
    private readonly carDetailsRepository: CarDetailsRepository,
    private readonly carImagesRepository: CarImageRepository
  ) {}

  #mergeDetailsToCar(car: Car, details: CarDetails): void {
    car.details = details;
  }

  #mergeImagesToCar(car: Car, images: string[]): void {
    car.images = images;
  }

  async #uploadImages(
    carId: number,
    images: File[]
  ): Promise<Omit<CarImage, 'id'>[]> {
    const uploadedImages = (
      await Promise.allSettled(
        (images as (File | string)[])
          .filter((image) => typeof image !== 'string')
          .map((image) =>
            Aws3Instance.uploadFile(
              'car',
              `${carId}-${Bun.randomUUIDv7()}`,
              image
            )
          )
      )
    )
      .filter((result) => result.status === 'fulfilled')
      .map((result) => ({ image: result.value, carId: carId }));

    return uploadedImages;
  }

  #serializeImages(images: { image: string }[]): string[] {
    return images.map((image) => Aws3Instance.getFileUrl(image.image));
  }

  #serializeCars(cars: Car[]): Car[] {
    return cars.map((car) => ({
      ...car,
      images: this.#serializeImages(car.images),
    }));
  }

  async getCars(skip: number, take: number): Promise<Car[]> {
    console.log(skip, take);
    const cars = await this.carsRepository.getCarsWithDetails(skip, take);
    return this.#serializeCars(cars);
  }

  async getCar(id: number): Promise<Car | null> {
    return await this.carsRepository.getCarWithDetails(id);
  }

  async getUserCars(userId: number): Promise<Car[]> {
    const cars = await this.carsRepository.getUserCarsWithDetails(userId);
    return this.#serializeCars(cars);
  }

  async createCar(
    data: Prisma.CarUncheckedCreateInput &
      Omit<Prisma.CarDetailsUncheckedCreateInput, 'carId'> & {
        userId: number;
        images: (File | string)[];
      }
  ): Promise<Car> {
    const carData = carSchema.parse(data);

    const car = await this.carsRepository.createCar({
      ...carData,
      userId: data.userId,
    } as Prisma.CarUncheckedCreateInput);
    const carDetailsData = carDetailsSchema.parse(data);

    const carDetails = await this.carDetailsRepository.createCarDetails({
      ...(carDetailsData as Prisma.CarDetailsUncheckedCreateInput),
      carId: car.id,
    });

    this.#mergeDetailsToCar(car, carDetails);

    if (data.images.length) {
      const images = await this.#uploadImages(car.id, data.images as File[]);
      await this.carImagesRepository.createCarImages(images);
      const carImages = await this.carImagesRepository.getCarImages(car.id);

      car.images = this.#serializeImages(carImages);
    }

    return car;
  }

  async updateCar(
    id: number,
    data: Prisma.CarUncheckedUpdateInput &
      Omit<Prisma.CarDetailsUncheckedUpdateInput, 'carId'> & {
        images: (File | string)[];
      }
  ): Promise<Car | null> {
    const carData = carSchema.parse(data);
    const carDetailsData = carDetailsSchema.parse(data);

    const carPromises: Promise<any>[] = [
      this.carsRepository.updateCar(id, carData as Prisma.CarUpdateInput),
      this.carDetailsRepository.updateCarDetails(
        id,
        carDetailsData as Prisma.CarDetailsUpdateInput
      ),
    ];

    if (data.images.length) {
      const images = await this.#uploadImages(id, data.images as File[]);
      if (images.length > 0) {
        await this.carImagesRepository.createCarImages(images);
      }
      carPromises.push(this.carImagesRepository.getCarImages(id));
    }

    const [car, carDetails, images] = await Promise.all(carPromises);
    this.#mergeDetailsToCar(car, carDetails);

    if (images?.length > 0) {
      this.#mergeImagesToCar(car, this.#serializeImages(images));
    }

    return car;
  }

  async deleteCar(id: number): Promise<Car | null> {
    return await this.carsRepository.deleteCar(id);
  }
}

export default CarsService;
