import type { IUser } from '@/core/entities/user';
import { BadRequestException, NotFoundException } from '@/core/exceptions';
import Aws3Instance from '@/core/lib/aws3';
import { fdToJson } from '@/core/utils/fdToJson';
import type UserService from '@/services/user.service';
import type { User } from '@prisma/client';
import type { BunRequest } from 'bun';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const registerSchema = z
  .object({
    name: z.string().min(2).max(100),
  })
  .merge(loginSchema);

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).max(100).optional(),
  password: z.string().min(8).max(100).optional(),
});

class UserController {
  constructor(private readonly userService: UserService) {}

  #userResponse(user: User): IUser {
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password: _, ...userWithoutPassword } = user as User;

    return {
      ...userWithoutPassword,
      avatar: userWithoutPassword?.avatar
        ? Aws3Instance.getFileUrl(userWithoutPassword.avatar)
        : null,
    };
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await this.userService.getUserById(id);
    } catch {
      throw new BadRequestException();
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userService.getUserByEmail(email);
  }

  async createUser(data: BunRequest): Promise<IUser> {
    if (!data.body) {
      throw new BadRequestException();
    }

    const body = await data.formData();

    const { avatar, ...user } = fdToJson(body);
    const validatedUser = registerSchema.safeParse(user);
    if (!validatedUser.success) {
      throw new BadRequestException();
    }

    if (await this.userService.getUserByEmail(validatedUser.data.email)) {
      throw new BadRequestException('Email already exists');
    }

    const userRecord = await this.userService.createUser(
      validatedUser.data,
      avatar
    );

    return this.#userResponse(userRecord as User);
  }

  async updateUser(id: string, data: BunRequest): Promise<IUser | null> {
    if (!data.body) {
      throw new BadRequestException();
    }

    const body = await data.json();

    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const validatedUser = userUpdateSchema.safeParse(body);
    if (!validatedUser.success) {
      throw new BadRequestException('Invalid user data');
    }

    return await this.userService.updateUser(id, validatedUser.data);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await this.userService.deleteUser(id);
  }

  async loginUser(data: BunRequest): Promise<IUser | null> {
    if (!data.body) {
      throw new BadRequestException();
    }

    const body = await data.json();

    const validatedUser = loginSchema.safeParse(body);
    if (!validatedUser.success) {
      throw new BadRequestException('Incorrect credentials');
    }

    const user = await this.userService.getUserByEmail(
      validatedUser.data.email
    );
    if (!user) {
      throw new BadRequestException('Incorrect credentials');
    }

    const userRecord = await this.userService.loginUser(
      validatedUser.data,
      user
    );

    return this.#userResponse(userRecord as User);
  }
}

export default UserController;
