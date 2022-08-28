import { RawClass } from "../misc";

export function Mix<
  B extends RawClass<any>,
  M extends Array<RawClass<any>>
>(Base: B, ...mixins: M): B & M[keyof M] {
  class MixedInstance extends Base {
    constructor(...args: Array<any>) {
      super(...args);

      for (const mixin of mixins) {
        copyProps(this, new mixin());
      }
    }
  }

  for (const mixin of mixins) {
    copyProps(MixedInstance.prototype, mixin.prototype);
    copyProps(MixedInstance, mixin);
  }

  return MixedInstance as B & M[keyof M];
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