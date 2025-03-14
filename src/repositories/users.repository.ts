import type { Prisma, PrismaClient, User } from '@prisma/client';

class UserRepository {
  constructor(private prismaClient: PrismaClient) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prismaClient.user.create({ data });
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.prismaClient.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prismaClient.user.findUnique({ where: { email } });
  }

  async updateUser(
    id: number,
    data: Prisma.UserUpdateInput
  ): Promise<User | null> {
    return await this.prismaClient.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User | null> {
    return await this.prismaClient.user.delete({ where: { id } });
  }
}

export default UserRepository;
