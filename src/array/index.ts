import { isEnumerable } from "../enum";
import {
    Enum,
    isBigInt,
    isBoolean,
    isBuffer,
    isConstructor,
    isEmpty,
    isFalse,
    isFunction,
    isInteger,
    isNil,
    isNull,
    isNumber,
    isObject,
    isRegExp,
    isString,
    isSymbol,
    isUndefined,
    isURL,
    nil,
    RawClass,
    toInteger
} from "../misc";
import { AnyObject } from "../object";

export function isArray<T=any>(o: Array<T> | unknown): o is Array<any> {
  return o && Array.isArray(o);
}

export function isObjectArray(o: Array<AnyObject> | unknown): o is Array<AnyObject> {
  return isArray(o) && o.every(isObject);
}

export function isStringArray(o: Array<string> | unknown): o is Array<string> {
  return isArray(o) && o.every(isString);
}

export function isNumberArray(o: Array<number> | unknown): o is Array<number> {
  return isArray(o) && o.every(isNumber);
}

export function isFunctionArray(o: Array<Function> | unknown): o is Array<Function> {
  return isArray(o) && o.every(isFunction);
}

export function isNullArray(o: Array<null> | unknown): o is Array<null> {
  return isArray(o) && o.every(isNull);
}

export function isUndefinedArray(
  o: Array<undefined> | unknown
): o is Array<undefined> {
  return isArray(o) && o.every(isUndefined);
}

export function isBigIntArray(o: Array<bigint> | unknown): o is Array<bigint> {
  return isArray(o) && o.every(isBigInt);
}

export function isIntegerArray(o: Array<number> | unknown): o is Array<number> {
  return isArray(o) && o.every(isInteger);
}

export function isEnumerableArray(o: Array<Enum> | unknown): o is Array<Enum> {
  return isArray(o) && o.every(isEnumerable);
}

export function isConstructorArray<T = any>(
  o: Array<RawClass<T>> | unknown
): o is Array<RawClass<T>> {
  return isArray(o) && o.every(isConstructor);
}

export function isBooleanArray(o: Array<boolean> | unknown): o is Array<boolean> {
  return isArray(o) && o.every(isBoolean);
}

export function isBufferArray(o: Array<Buffer> | unknown): o is Array<Buffer> {
  return isArray(o) && o.every(isBuffer);
}

export function isNilArray(o: Array<nil> | unknown): o is Array<nil> {
  return isArray(o) && o.every(isNil);
}

export function isURLArray(o: Array<URL> | unknown): o is Array<URL> {
  return isArray(o) && o.every(isURL);
}

export function isSymbolArray(o: Array<symbol> | unknown): o is Array<symbol> {
  return isArray(o) && o.every(isSymbol);
}

export function moveItemInArray<T = any>(
  arr: Array<T>,
  oldIndex: number,
  newIndex: number
): Array<T> {
  if (!isNumber(oldIndex) || !isNumber(newIndex)) {
    return arr;
  }

  while (oldIndex < 0) {
    oldIndex += arr.length;
  }

  while (newIndex < 0) {
    newIndex += arr.length;
  }

  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }

  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

  return arr;
}

export function compact<T>(arr: Array<T>): Array<T> {
  return arr.filter(
    (value) => !isNil(value) && !isFalse(value) && !isEmpty(value)
  );
}

export function moveItemsInArray<T = any>(
  arr: Array<T>,
  ...itemsToMove: Array<{ new: number; old: number }>
): Array<T> {
  for (const item of itemsToMove) {
    arr = moveItemInArray<T>(arr, item.old, item.new);
  }

  return arr;
}

export function shuffle<T extends Array<T>>(arr: T) {
  if (!isArray(arr)) {
    return [];
  }

  let r = arr.length,
    t: any,
    i: number;

  while (r) {
    i = Math.floor(Math.random() * r--);

    t = arr[r];
    arr[r] = arr[i];
    arr[i] = t;
  }

  return arr;
}

export function random<T>(arr?: Array<T>): number | T | undefined {
  if (isArray(arr)) {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }

  return Math.random();
}

export function findWhere<T>(arr: Array<T>, query: any): T | undefined {
  const typeOf = typeof query;

  return arr
    .filter((v) => typeof v === typeOf)
    .find((v) => {
      function resolve(q = query, v_ = v) {
        if (typeof q !== "object" && typeof v_ !== "object") {
          return q === v_;
        } else if (v_ && typeof v_ === "object") {
          const queryEntries = Object.entries(q);

          for (const [K, V] of queryEntries) {
            const value = v_[K];
            const typeOfV = typeof V;

            if (typeof value === typeOfV) {
              if (
                typeof value === "object" &&
                typeOfV === "object" &&
                value !== V
              ) {
                return resolve(V, value);
              }

              return value === V;
            }
          }
        } else {
          return false;
        }
      }

      return resolve();
    });
}

export function arrayToIterator<T>(arr: Array<T>) {
  if (!isArray(arr)) {
    return [].entries();
  }

  return arr.entries();
}

export function isRegExpArray(o: Array<RegExp> | unknown): o is Array<RegExp> {
  return isArray(o) && o.every(isRegExp);
}

export function clearArray<T>(o: Array<T>) {
    if (!isArray(o)) {
        return []
    }

    return o.filter(x => x)
}

export function chunk<T extends Array<any>>(arr: T, size: number): Array<T> {
  const chunk = [];
  size = toInteger(size);

  if (!arr.length) {
    return [];
  }

  let index = 0;
  let rindex = 0;

  while (index < arr.length) {
    chunk[rindex++] = arr.slice(index, (index += size));
  }

  return chunk;
}