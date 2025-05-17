import { ConfigService } from '@nestjs/config';

// Рекурсивно генерує вкладені ключі типу "jwt.secret"
type DotNestedKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}` | `${K}.${DotNestedKeys<T[K]>}`
        : `${K}`;
    }[keyof T & string]
  : never;

// Витягує тип значення по шляху "jwt.secret"
type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? ValueAtPath<T[K], R>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export class TypedConfigGetter<T> {
  constructor(private readonly config: ConfigService<T>) {}

  get<P extends DotNestedKeys<T>>(path: P): ValueAtPath<T, P> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.config.get(path as any) as ValueAtPath<T, P>;
  }
}
