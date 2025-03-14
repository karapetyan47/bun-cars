import { BadRequestException } from '@/core/exceptions';
import { fullCarSchema } from '@/core/schemas/car.shema';
import { fdToJson } from '@/core/utils/fdToJson';
import type CarsService from '@/services/cars.service';
import type ManufacturerService from '@/services/manufacturer.service';
import type ModelService from '@/services/model.service';
import type TypeService from '@/services/type.service';
import type { BunRequest } from 'bun';

class CarController {
  constructor(
    private readonly carService: CarsService,
    private readonly manufacturerService: ManufacturerService,
    private readonly modelService: ModelService,
    private readonly typeService: TypeService
  ) {}
  async #validateManufacturerId(id: number) {
    const manufacturer = await this.manufacturerService.getManufacturerById(
      id.toString()
    );
    if (!manufacturer) {
      throw new BadRequestException('Invalid manufacturer id');
    }
  }

  async #validateModelId(id: number) {
    const model = await this.modelService.getModelById(id.toString());
    if (!model) {
      throw new BadRequestException('Invalid model id');
    }
  }

  async #validateTypeId(id: number) {
    const type = await this.typeService.getTypeById(id.toString());
    if (!type) {
      throw new BadRequestException('Invalid type id');
    }
  }

  async getCars() {
    return await this.carService.getCars();
  }

  async getUserCars(data: BunRequest) {
    return await this.carService.getUserCars(data.user.id);
  }

  async createCar(data: BunRequest) {
    if (!data.body) {
      throw new BadRequestException();
    }

    const formData = await data.formData();

    const carJson = fdToJson(formData, {
      manufacturerId: (v: string) => Number(v),
      modelId: (v: string) => Number(v),
      userId: (v: string) => Number(v),
      typeId: (v: string) => Number(v),
      price: (v: string) => Number(v),
      year: (v: string) => Number(v),
    });

    const { success, data: validatedCarData } =
      fullCarSchema.safeParse(carJson);

    if (!success) {
      throw new BadRequestException('Invalid car data');
    }

    await Promise.all([
      this.#validateManufacturerId(validatedCarData.manufacturerId),
      this.#validateModelId(validatedCarData.modelId),
      this.#validateTypeId(validatedCarData.typeId),
    ]);

    return await this.carService.createCar({
      ...validatedCarData,
      userId: data.user.id as number,
      images: formData.getAll('images'),
    });
  }

  async updateCar(id: string, data: BunRequest) {
    if (!data.body) {
      throw new BadRequestException();
    }

    const formData = await data.formData();

    return await this.carService.updateCar(id, formData);
  }

  async deleteCar(id: string) {
    return await this.carService.deleteCar(id);
  }
}

export default CarController;
