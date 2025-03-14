import type { User } from '@prisma/client';

export type IUser = Omit<User, 'password'> & { token?: string };
