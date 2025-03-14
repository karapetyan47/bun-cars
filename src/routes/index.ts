import type { PrismaClient } from '@prisma/client';
import UserRoutes from './user.routes';
import ControllerFactory from '@/controllers/index';
import CarRoutes from './car.routes';

class RoutesFactory {
  private readonly controllerFactory: ControllerFactory;
  constructor(private readonly dbClient: PrismaClient) {
    this.controllerFactory = new ControllerFactory(dbClient);
  }

  createUserRoute() {
    const userController = this.controllerFactory.createUserController();
    const userRoutes = new UserRoutes(userController);

    return userRoutes;
  }

  createCarRoute() {
    const carController = this.controllerFactory.createCarController();
    const carRoutes = new CarRoutes(carController);

    return carRoutes;
  }
}

export default function initRoutes(dbClient: PrismaClient) {
  const routesFactory = new RoutesFactory(dbClient);

  return {
    ...routesFactory.createUserRoute(),
    ...routesFactory.createCarRoute(),
  };
}
