import type { BunRequest } from 'bun';
import { User } from '@prisma/client';

declare global {
  type AuthenticatedRequest<T extends string = string> = BunRequest<T> & {
    user: User;
  };
}
