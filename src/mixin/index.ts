import { RawClass } from "../misc";

type Proto<T extends RawClass<any>> = T["prototype"];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type MixedArgs<M extends RawClass<any>[]> = {
  [K in keyof M]: keyof ConstructorParameters<M[K]>;
};

export type MixedInstance<M extends RawClass<any>[]> = UnionToIntersection<{
  [K in keyof M]: Proto<M[K]>;
}[number]>;

export type Mixed<M extends RawClass<any>[]> = {
  new (...args: MixedArgs<M>): MixedInstance<M>;
  prototype: MixedInstance<M>;
};

export function Mix<M extends Array<any>>(...mixins: M): Mixed<M> {
  const instances = Symbol("instances");
  class MixedInstance {
    [instances] = new WeakMap();
    constructor(...args: any[]) {
      let i = 0;
      for (const mixin of mixins) {
        const toExtend = new mixin[i](...(args[i] || []));
        const extended = extend(this, toExtend);

        this[instances].set(mixin, extended);

        for (const key of Object.keys(toExtend)) {
          Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => toExtend[key],
            set: (value) => (toExtend[key] = value),
          });
        }
        i++;
      }
    }
  }

  return MixedInstance;
}

function extend(base: any, extension: RawClass<any>) {
  return new Proxy(base, {
    get: (_, prop) => (prop in extension ? extension : base)[prop],
    set: (_, prop, value) =>
      !!((prop in extension ? extension : base)[prop] = value),
  });
}

function copyProps(target: any, source: any) {
  Object.getOwnPropertyNames(source)
    .concat(Object.getOwnPropertyNames(source))
    .forEach((prop) => {
      if (
        !prop.match(
          /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
        )
      )
        Object.defineProperty(
          target,
          prop,
          Object.getOwnPropertyDescriptor(source, prop)
        );
    });
}
