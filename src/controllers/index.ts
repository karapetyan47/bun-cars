import type { PrismaClient } from '@prisma/client';
import UserController from '@/controllers/user.controller';
import UserService from '@/services/user.service';
import UserRepository from '@/repositories/users.repository';
import CarController from './car.controller';
import CarsService from '@/services/cars.service';
import CarRepository from '@/repositories/cars.repository';
import CarDetailsRepository from '@/repositories/carDetails.repository';
import CarImageRepository from '@/repositories/carImage.repository';
import ManufacturerService from '@/services/manufacturer.service';
import ModelService from '@/services/model.service';
import TypeService from '@/services/type.service';
import ManufacturerRepository from '@/repositories/manufacturer.repository';
import ModelRepository from '@/repositories/model.repository';
import TypeRepository from '@/repositories/type.repository';

class ControllerFactory {
  constructor(private readonly dbClient: PrismaClient) {}

  createUserController() {
    return new UserController(
      new UserService(new UserRepository(this.dbClient))
    );
  }

  createCarController() {
    return new CarController(
      new CarsService(
        new CarRepository(this.dbClient),
        new CarDetailsRepository(this.dbClient),
        new CarImageRepository(this.dbClient)
      ),
      new ManufacturerService(new ManufacturerRepository(this.dbClient)),
      new ModelService(new ModelRepository(this.dbClient)),
      new TypeService(new TypeRepository(this.dbClient))
    );
  }
}

export default ControllerFactory;
