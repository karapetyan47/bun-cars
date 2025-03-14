import type CarController from '@/controllers/car.controller';
import { Auth } from '@/core/decorators/auth';
import { Route, Router } from '@/core/decorators/router';

@Router('/cars')
class CarRoutes {
  constructor(private readonly carController: CarController) {}

  @Route()
  async getCars() {
    const cars = await this.carController.getCars();
    return new Response(JSON.stringify(cars));
  }

  @Route('/create', 'POST')
  @Auth()
  async createCar(req: AuthenticatedRequest) {
    const car = await this.carController.createCar(req);
    return new Response(JSON.stringify(car));
  }

  @Route('/update/:id', 'PUT')
  @Auth()
  async updateCar(req: AuthenticatedRequest<'/update/:id'>) {
    const car = await this.carController.updateCar(req.params.id, req);
    return new Response(JSON.stringify(car));
  }
}

export default CarRoutes;
