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
    const manufacturer = await this.manufacturerService.getManufacturerById(id);
    if (!manufacturer) {
      throw new BadRequestException('Invalid manufacturer id');
    }
  }

  async #validateModelId(id: number) {
    const model = await this.modelService.getModelById(id);
    if (!model) {
      throw new BadRequestException('Invalid model id');
    }
  }

  async #validateCarData(formData: FormData) {
    const carJson = fdToJson(formData, {
      manufacturerId: (v: FormDataEntryValue) => Number(v),
      modelId: (v: FormDataEntryValue) => Number(v),
      userId: (v: FormDataEntryValue) => Number(v),
      typeId: (v: FormDataEntryValue) => Number(v),
      price: (v: FormDataEntryValue) => Number(v),
      year: (v: FormDataEntryValue) => Number(v),
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

    return { ...validatedCarData, images: formData.getAll('images') };
  }

  async #validateTypeId(id: number) {
    const type = await this.typeService.getTypeById(id);
    if (!type) {
      throw new BadRequestException('Invalid type id');
    }
  }

  async getCars(req: BunRequest) {
    const searchParams = new URL(req.url).searchParams;
    const { page = 1, limit = 10 } = searchParams;
    console.log('Request:', new URL(req.url).searchParams);
    return await this.carService.getCars(page - 1, limit);
  }

  async getUserCars(req: AuthenticatedRequest) {
    return await this.carService.getUserCars(req.user.id);
  }

  async createCar(req: AuthenticatedRequest) {
    if (!req.body) {
      throw new BadRequestException();
    }

    const formData = await req.formData();

    const carData = await this.#validateCarData(formData);

    return await this.carService.createCar({
      ...carData,
      userId: req.user.id as number,
    });
  }

  async updateCar(id: string, req: AuthenticatedRequest) {
    if (!req.body) {
      throw new BadRequestException();
    }

    const formData = await req.formData();
    const carData = await this.#validateCarData(formData);

    return await this.carService.updateCar(Number(id), {
      ...carData,
      userId: req.user.id,
    });
  }

  async deleteCar(id: string) {
    return await this.carService.deleteCar(Number(id));
  }
}

export default CarController;
