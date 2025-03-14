import UserController from '@/controllers/user.controller';
import { Auth } from '@/core/decorators/auth';
import { Route, Router } from '@/core/decorators/router';
import type { BunRequest } from 'bun';

@Router('/users')
class UserRoutes {
  constructor(private readonly userController: UserController) {}

  @Route('/:id')
  @Auth()
  async getUser(req: BunRequest<':id'>) {
    const user = await this.userController.getUserById(req.params.id);
    return new Response(JSON.stringify(user));
  }

  @Route('/signup', 'POST')
  async createUser(req: BunRequest) {
    const user = await this.userController.createUser(req);
    return new Response(JSON.stringify(user));
  }

  @Route('/login', 'POST')
  async loginUser(req: BunRequest) {
    const user = await this.userController.loginUser(req);
    return new Response(JSON.stringify(user));
  }

  @Route('/:id', 'DELETE')
  @Auth()
  async deleteUser(req: BunRequest<':id'>) {
    await this.userController.deleteUser(req.params.id);
    return new Response(JSON.stringify({ message: 'User deleted' }));
  }

  @Route('/:id', 'PATCH')
  @Auth()
  async updateUser(req: BunRequest<':id'>) {
    const user = await this.userController.updateUser(req.params.id, req);
    return new Response(JSON.stringify(user));
  }
}

export default UserRoutes;
