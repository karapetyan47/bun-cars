import type { BunRequest } from 'bun';
import { prisma } from '@/core/db/prisma.db';
import { UnauthorizedException } from '@/core/exceptions';
import Jwt from '@/core/lib/jwt';

export function Auth() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const request = args[0] as BunRequest;
        const bearerToken = request.headers.get('Authorization');
        const token = bearerToken?.split(' ')[1];
        if (!token) {
          throw new UnauthorizedException();
        }

        const { payload } = await Jwt.verifyToken(token);

        const user = await prisma!.user.findUnique({
          where: {
            id: Number(payload.userId),
          },
          omit: {
            password: true,
          },
        });

        if (!user) {
          throw new UnauthorizedException();
        }

        request.user = user;

        return originalMethod.apply(this, [request, ...args.slice(1)]);
      } catch {
        throw new UnauthorizedException();
      }
    };

    return descriptor;
  };
}
