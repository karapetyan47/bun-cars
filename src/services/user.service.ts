import type UserRepository from '@/repositories/users.repository';
import { BadRequestException } from '@/core/exceptions';
import Aws3Instance from '@/core/lib/aws3';
import Jwt from '@/core/lib/jwt';
import type { Prisma, User } from '@prisma/client';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    user: Prisma.UserUncheckedCreateInput,
    avatar: string | File | null
  ): Promise<User | null> {
    const hashPassword = await Bun.password.hash(user.password, {
      algorithm: 'bcrypt',
      cost: Number(Bun.env.PASSWORD_HASH_COST),
    });

    const userRecord = await this.userRepository.createUser({
      ...user,
      password: hashPassword,
    });

    let userAvatar = avatar;
    if (avatar && avatar instanceof File) {
      userAvatar = await Aws3Instance.uploadFile(
        'user',
        userRecord.id.toString(),
        avatar
      );
    }

    const userRecordWithAvatar = await this.userRepository.updateUser(
      userRecord.id.toString(),
      {
        avatar: userAvatar as string,
      }
    );

    return userRecordWithAvatar;
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.getUserByEmail(email);
  }

  async updateUser(
    id: string,
    user: Prisma.UserUncheckedUpdateInput
  ): Promise<User | null> {
    return await this.userRepository.updateUser(id, user);
  }

  async deleteUser(id: string): Promise<User | null> {
    return await this.userRepository.deleteUser(id);
  }

  async loginUser(
    user: {
      email: string;
      password: string;
    },
    userRecord: User
  ): Promise<(User & { token: string }) | null> {
    const isPasswordValid = await Bun.password.verify(
      user.password,
      userRecord.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect credentials');
    }

    const token = await Jwt.generateToken({ userId: userRecord.id });

    return { ...userRecord, token };
  }
}

export default UserService;
