import { Stream } from "stream";
import { Type } from "./misc";
import { isArray, isFunctionArray, isNumberArray, isEnumerableArray, isBigIntArray, isConstructorArray, isUndefinedArray, isNullArray, isObjectArray, isIntegerArray, isBooleanArray, isStringArray, isURLArray, isSymbolArray, isBufferArray, isNilArray, isRegExpArray } from "./array";
import { isEnumerable } from "./enum";
import { RawClass, isObject, isNumber, isString, isBoolean, isURL, isConstructor, isUndefined, isNull, isInteger, isBiggerThen, isLessThen, isBigInt, isTrue, isFalse, extendsClass, instanceOf, isSymbol, isRegExp, isBuffer, isNil, isStream } from "./misc";
import { Mix } from "./mixin";

/**
 * Parse a object
 *
 * ```py
 * +-------------------------+
 * |        WARNING          |
 * | args paramenter is only |
 * |    necessary if o is    |
 * |     a custom class      |
 * +-------------------------+
 * ```
 */
export function parse<T>(o: T, ...args: Array<string>): Parse<T> & T {
  let Parsed: RawClass<any>;

  if (isArray(o)) {
    const arr = o;

    Parsed = class extends Mix(Array, Parse) {
      _o: T;
      constructor() {
        super(...arr);
        this._o = o;
      }
    };

    return new Parsed();
  } else if (isObject(o)) {
    Parsed = class extends Mix(Object, Parse) {
      _o: T;
      constructor() {
        super(o);
        this._o = o;
      }
    };
  } else if (isNumber(o)) {
    Parsed = class extends Mix(Number, Parse) {
      _o: T;
      constructor() {
        super(o);
        this._o = o;
      }
    };
  } else if (isString(o)) {
    Parsed = class extends Mix(String, Parse) {
      _o: T;
      constructor() {
        super(o);
        this._o = o;
      }
    };
  } else if (isBoolean(o)) {
    Parsed = class extends Mix(Boolean, Parse) {
      _o: T;
      constructor() {
        super(o);
        this._o = o;
      }
    };
  } else if (isURL(o)) {
    Parsed = class extends Mix(URL, Parse) {
      _o: T;
      constructor() {
        super(o);
        this._o = o;
      }
    };
  } else if (isConstructor(o)) {
    Parsed = class extends Mix(o, Parse) {
      _o: T;
      constructor(...args: Array<any>) {
        super(...args);
        this._o = o;
      }
    };
  }

  return new Parsed(...args);
}

export class Parse<T> {
  private readonly _o: T;
  constructor(o: T) {
    Object.defineProperty(this, "_o", {
      value: o,
    });
  }

  public isString(): this is string {
    return isString(this._o);
  }

  public isNumber(): this is number {
    return isNumber(this._o);
  }

  public isConstructor<T = any>(): this is RawClass<T> {
    return isConstructor(this._o);
  }

  public isEnumerable(): this is object {
    return isEnumerable(this._o);
  }

  public isUndefined(): this is undefined {
    return isUndefined(this._o);
  }

  public isNull(): this is null {
    return isNull(this._o);
  }

  public isInteger(): this is number {
    return isInteger(this._o);
  }

  public isBiggerThen(t: number): boolean {
    return isBiggerThen(this._o, t);
  }

  public isLessThen(t: number): boolean {
    return isLessThen(this._o, t);
  }

  public isObject(): this is object {
    return isObject(this._o);
  }

  public isBigInt(): this is bigint {
    return isBigInt(this._o);
  }

  public isFunction(): this is Function {
    return this.isFunction();
  }

  public isTrue(): this is true {
    return isTrue(this._o);
  }

  public isFalse(): this is false {
    return isFalse(this._o);
  }

  public isURL(): this is URL {
    return isURL(this._o);
  }

  public extends<T = any>(c: RawClass<T>): boolean {
    return extendsClass(this._o as unknown as Function, c);
  }

  public instanceOf<T extends Function>(t: T): this is T {
    return instanceOf(this._o, t);
  }

  public isSymbol(): this is symbol {
    return isSymbol(this._o);
  }

  public isRegExp(): this is RegExp {
    return isRegExp(this._o);
  }

  public isBuffer(): this is Buffer {
    return isBuffer(this._o);
  }

  public isNil(): this is null | undefined {
    return isNil(this._o);
  }

  public isStream(): this is Stream {
    return isStream(this._o);
  }

  public isArray(type?: Type): this is Array<any>;
  public isArray(type: "number"): this is Array<number>;
  public isArray(type: "enumerable"): this is Array<object>;
  public isArray(type: "bigint"): this is Array<bigint>;
  public isArray(type: "undefined"): this is Array<undefined>;
  public isArray(type: "null"): this is Array<null>;
  public isArray(type: "object"): this is Array<object>;
  public isArray(type: "integer"): this is Array<number>;
  public isArray(type: "boolean"): this is Array<boolean>;
  public isArray(type: "string"): this is Array<string>;
  public isArray(type: "function"): this is Array<Function>;
  public isArray(type: "any"): this is Array<any>;
  public isArray(type: "url"): this is Array<URL>;
  public isArray(type: "symbol"): this is Array<symbol>;
  public isArray(type: "buffer"): this is Array<Buffer>;
  public isArray(type: "nil"): this is Array<null | undefined>;
  public isArray(type: "regexp"): this is Array<RegExp>;
  public isArray<T = any>(type: "constructor"): this is Array<RawClass<T>>;
  public isArray(type: Type = "any"): this is Array<any> {
    const isArrayType = {
      any: isArray(this._o),
      function: isFunctionArray(this._o),
      number: isNumberArray(this._o),
      enumerable: isEnumerableArray(this._o),
      bigint: isBigIntArray(this._o),
      constructor: isConstructorArray(this._o),
      undefined: isUndefinedArray(this._o),
      null: isNullArray(this._o),
      object: isObjectArray(this._o),
      integer: isIntegerArray(this._o),
      boolean: isBooleanArray(this._o),
      string: isStringArray(this._o),
      url: isURLArray(this._o),
      symbol: isSymbolArray(this._o),
      buffer: isBufferArray(this._o),
      nil: isNilArray(this._o),
      regexp: isRegExpArray(this._o),
    };

    return isArrayType[type];
  }

  get value(): T {
    return this._o;
  }
}
