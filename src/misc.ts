import EventEmitter from "node:events";
import { Stream } from "node:stream";
import { isArray } from "./array";
import type { AnyObject } from "./object";

export type RawClass<T, Keys extends Array<any> = Array<any>> = new (
  ...args: Keys
) => T;

export type Type =
  | "number"
  | "function"
  | "string"
  | "boolean"
  | "object"
  | "bigint"
  | "integer"
  | "null"
  | "undefined"
  | "enumerable"
  | "constructor"
  | "url"
  | "symbol"
  | "buffer"
  | "nil"
  | "regexp"
  | "any";

export type TypedFromTypes =
  | Type
  | `Array<${Type}>`
  | Record<string, Type | `Array<${Type}>`>;

export type AnyInstance = Function | Record<any, any>;
export type nil = null | undefined
export type Enum = Record<string | number, string | number>

export function isString (o: string | unknown): o is string {
    return o && typeof o === "string";
}

export function isFunction (o: Function | unknown): o is Function {
    return o && typeof o === "function";
}

export function isObject (o: AnyObject | unknown): o is object {
    return o && typeof o === "object";
}

export function isNull (o: null | unknown): o is null {
    return !o && typeof o === "object" && o === null;
}

export function isUndefined (o: undefined | unknown): o is undefined {
    return !o && typeof o === "undefined";
}

export function isNumber (o: unknown | number): o is number {
    return o && typeof o === "number";
}

export function isBigInt (o: bigint | unknown): o is bigint {
    return o && typeof o === "bigint";
}

export function isBoolean (o: boolean | unknown): o is boolean {
    return typeof o === "boolean";
}

export function isTrue (o: boolean | unknown): o is true {
    return o === true;
}

export function isFalse (o: boolean | unknown): o is false {
    return o === false;
}

export function isInteger(o: number | unknown): o is number {
    return isNumber(o) && Number.isInteger(o);
}

export function isBiggerThen(o: number | unknown, o2: number | unknown): boolean {
  return isNumber(o) && isNumber(o2) && o > o2;
}

export function isLessThen(o: number | unknown, o2: number | unknown): boolean {
  return isNumber(o) && isNumber(o2) && o < o2;
}

export function isConstructor<T = any>(o: Function | unknown): o is RawClass<T> {
  return isFunction(o) && !!o.prototype.constructor;
}

export function extendsClass(o: Function, o2: Function): boolean {
  return isConstructor(o) && isConstructor(o2) && o.prototype instanceof o2;
}

export function isSymbol(o: symbol | unknown): o is symbol {
  return o && typeof o === "symbol";
}

export function isURL(o: string | URL | unknown): o is URL {
  if (isString(o as string)) {
    try {
      o = new URL(o as string);
    } catch {
      return false;
    }
  }

  return instanceOf(o as URL, URL);
}

export function instanceOf(o: AnyInstance, o2: Function): boolean {
  return o && isFunction(o2) && o instanceof o2;
}

export function toInteger(o: number | string) {
  o = Number(o);

  if (!isNumber(o)) {
    return 0;
  }

  return Math.round(o);
}

export function isRegExp(o: unknown | RegExp): o is RegExp {
  return o && instanceOf(o, RegExp);
}

export function isNil(o: unknown | nil): o is null | undefined {
  return isNull(o) || isUndefined(o);
}

export function isBuffer(o: unknown | Buffer): o is Buffer {
  return o && Buffer.isBuffer(o);
}

export function isEqual<_1 extends any, _2 extends any>(o1: _1, o2: _2): boolean {
  const equalObject =
    (t: any) =>
    ([key, value]: [string, any]) =>
      isEqual(value, t[key]);
  const equalArray = (t: any) => (value: any, index: number) =>
    isEqual(value, t[index]);

  if (o1 === o2) {
    return true;
  }

  if (isArray(o1) && isArray(o2)) {
    return o1.every(equalArray(o2)) && o2.every(equalArray(o1));
  }

  if (isMap(o1) && isMap(o2)) {
    return iteratorToArray(o1.entries()).every(equalObject(o2));
  }

  if (typeof o1 !== typeof o2) {
    return false;
  }

  if (isSymbol(o1) && isSymbol(o2)) {
    return o1.description === o2.description;
  }

  if (isRegExp(o1) && isRegExp(o2)) {
    return o1.source === o2.source;
  }

  if (isNumber(o1) && isNumber(o2)) {
    return +o1 == +o2 || (+o1 != +o1 && +o2 != +o2);
  }

  if (isFunction(o1) && isFunction(o2)) {
    return o1.toString() === o2.toString();
  }

  if (isObject(o1) && isObject(o2)) {
    return (
      Object.entries(o1).every(equalObject(o2)) &&
      Object.entries(o2).every(equalObject(o1))
    );
  }

  return false;
}

export function isIterator<T = unknown>(o: unknown | IterableIterator<T>): o is IterableIterator<T> {
  return isObject(o) && Symbol.iterator in o;
}

export function isDate(o: unknown | Date): o is Date {
  return o && instanceOf(o, Date);
}

export function isSet<T = unknown>(o: Set<T> | unknown): o is Set<T> {
  return o && instanceOf(o, Set);
}

export function isMap<K = string, V = unknown>(o: unknown | Map<K, V>): o is Map<K, V> {
  return o && instanceOf(o, Map);
}

export function isWeakMap<K extends AnyObject = any, V = unknown>(
  o: unknown
): o is WeakMap<K, V> {
  return o && instanceOf(o, WeakMap);
}

export function isWeakSet<T extends AnyObject = any>(o: unknown | WeakSet<T>): o is WeakSet<T> {
  return o && instanceOf(o, WeakSet);
}

export function isWeakRef<T extends AnyObject = any>(o: unknown | WeakRef<T>): o is WeakRef<T> {
  return o && instanceOf(o, WeakRef);
}

export function isAbortController(o: unknown | AbortController): o is AbortController {
  return o && instanceOf(o, AbortController);
}

export function isEventEmitter(o: unknown | EventEmitter): o is EventEmitter {
  return o && isFunction(o) && o.name === "EventEmitter";
}

export function isHttp(url: string | URL): boolean {
  if (!isURL(url)) {
    return false;
  }

  if (isString(url)) {
    url = new URL(url);
  }

  return url.protocol === "http:";
}

export function isStream(o: unknown | Stream): o is Stream {
  let _o = o as any;
  return isObject(o) && isFunction(_o.pipe);
}

export function iteratorToArray<T>(
  iterator: IterableIterator<T>,
  length?: number
): Array<T> {
  if (!isObject(iterator)) {
    return [];
  }

  if (length) {
    return Array.from({ length }, () => iterator.next().value);
  } else {
    return [...iterator];
  }
}

export function isHttps(url: string | URL): boolean {
  if (!isURL(url)) {
    return false;
  }

  if (isString(url)) {
    url = new URL(url);
  }

  return url.protocol === "https:";
}

export function isEmpty(o: string | Array<any> | Buffer | number | unknown) {
  if (isString(o)) {
    return o === "";
  } else if (isNumber(o)) {
    return o === 0;
  } else if (isArray(o)) {
    return !o.length;
  }

  return !isObject(o) && !isArray(o) && !isBuffer(o);
}

export function bind<T extends Function>(thisArg: any, fn: T): T {
  if (!isFunction(fn)) {
    throw new TypeError(
      "Binding: fn must be a function, but received " + typeof fn
    );
  }

  return fn.bind(thisArg);
}

export function call<T extends (...args: Array<any>) => any>(
  thisArg: any,
  fn: T,
  ...args: Array<any>
): ReturnType<T> {
  if (!isFunction(fn)) {
    throw new TypeError(
      "Binding: fn must be a function, but received " + typeof fn
    );
  }

  return fn.call(thisArg, ...args);
}

export function forOwn<T extends object>(
  o: T,
  fn: (value: any, key: string, object: T) => void
): void {
  if (!isObject(o)) {
    return;
  }

  for (const key of Object.keys(o)) {
    fn(o[key], key, o);
  }
}

export function createMathOperation(
  fn: (first: number, second: number) => number,
  defaultValue = 1
): (value1: number, value2: number) => number {
  return (value1: number, value2: number) => {
    const v1NoU = isUndefined(value1) || isNull(value1);
    const v2NoU = isUndefined(value2) || isNull(value2);

    value1 = Number(value1);
    value2 = Number(value2);

    if (v1NoU && v2NoU) {
      return defaultValue;
    } else if (!v1NoU && v2NoU) {
      return value2;
    } else if (v1NoU && !v2NoU) {
      return value1;
    }

    return fn(value1, value2);
  };
}