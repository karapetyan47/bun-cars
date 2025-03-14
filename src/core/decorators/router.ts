import baseRoute from '@/utils/baseRoute';
import type { RouterTypes } from 'bun';
const SubMethods = Symbol('SubMethods');
type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export function Route(path = '/', method: HTTPMethod = 'GET') {
  return (target: any, propertyKey: string) => {
    target[SubMethods] = target[SubMethods] || new Map();
    target[SubMethods].set(propertyKey, { method, requestName: path });
  };
}

export function Router(basePath = '/') {
  return function <
    T extends { new (...args: any[]): object },
    R extends { [K in keyof R]: RouterTypes.RouteValue<K & string> },
  >(Base: T) {
    return class extends Base {
      constructor(...args: any[]) {
        super(...args);
        const subMethods = Base.prototype[SubMethods];
        const routes: Record<string, R> = {};
        if (subMethods) {
          subMethods.forEach(
            (
              {
                method,
                requestName,
              }: { method: HTTPMethod; requestName: string },
              orignalMethod: keyof this
            ) => {
              routes[requestName] = {
                ...(routes[requestName] || {}),
                [method]: (this[orignalMethod] as (v: any) => any).bind(this),
              };
            }
          );
        }

        return baseRoute(basePath)(routes);
      }
    };
  };
}
