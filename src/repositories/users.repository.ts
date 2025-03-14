import type { Prisma, PrismaClient, User } from '@prisma/client';

class UserRepository {
  constructor(private prismaClient: PrismaClient) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prismaClient.user.create({ data });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.prismaClient.user.findUnique({
      where: { id: Number(id) },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prismaClient.user.findUnique({ where: { email } });
  }

  async updateUser(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<User | null> {
    return await this.prismaClient.user.update({
      where: { id: Number(id) },
      data,
    });
  }

  async deleteUser(id: string): Promise<User | null> {
    return await this.prismaClient.user.delete({ where: { id: Number(id) } });
  }
}

export default UserRepository;
