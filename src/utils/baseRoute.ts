import type { RouterTypes } from 'bun';

const baseRoute =
  (basePath: string) =>
  <R extends { [K in keyof R]: RouterTypes.RouteValue<K & string> }>(
    routes: R
  ) =>
    Object.entries(routes).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [`${basePath}${key}`]: value,
      }),
      {}
    ) as R;

export default baseRoute;
