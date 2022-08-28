import { isFunctionArray, isNumberArray, isEnumerableArray, isBigIntArray, isConstructorArray, isUndefinedArray, isNullArray, isObjectArray, isIntegerArray, isBooleanArray, isStringArray, isURLArray, isSymbolArray, isArray, isBufferArray, isRegExpArray, isNilArray } from "./array";
import { isEnumerable } from "./enum";
import { TypedFromTypes, isFunction, isNumber, isBigInt, isConstructor, isUndefined, isNull, isObject, isInteger, isBoolean, isString, isURL, isSymbol, isNil, isRegExp, isBuffer } from "./misc";

export function checkType<T>(o: T, type: TypedFromTypes): T | false {
  const resolve = (t: string, _o = o) => {
    const ob = {
      any: true,
      function: isFunction(_o),
      number: isNumber(_o),
      enumerable: isEnumerable(_o),
      bigint: isBigInt(_o),
      constructor: isConstructor(_o),
      undefined: isUndefined(_o),
      null: isNull(_o),
      object: isObject(_o),
      integer: isInteger(_o),
      boolean: isBoolean(_o),
      string: isString(_o),
      url: isURL(_o),
      symbol: isSymbol(_o),
      nil: isNil(_o),
      regexp: isRegExp(_o),
      buffer: isBuffer(_o),
      "Array<function>": isFunctionArray(_o),
      "Array<number>": isNumberArray(_o),
      "Array<enumerable>": isEnumerableArray(_o),
      "Array<bigint>": isBigIntArray(_o),
      "Array<constructor>": isConstructorArray(_o),
      "Array<undefined>": isUndefinedArray(_o),
      "Array<null>": isNullArray(_o),
      "Array<object>": isObjectArray(_o),
      "Array<integer>": isIntegerArray(_o),
      "Array<boolean>": isBooleanArray(_o),
      "Array<string>": isStringArray(_o),
      "Array<url>": isURLArray(_o),
      "Array<symbol>": isSymbolArray(_o),
      "Array<any>": isArray(_o),
      "Array<buffer>": isBufferArray(_o),
      "Array<regexp>": isRegExpArray(_o),
      "Array<nil>": isNilArray(_o),
    };

    return ob[t];
  };

  if (!isObject(o) && isString(type) && !resolve(type)) {
    return false;
  }

  if (isObject(o)) {
    if (isObject(type)) {
      const check = (te: any) => {
        for (const key of Object.keys(te)) {
          if (isObject(te[key])) {
            check(te[key]);
            continue;
          }

          if (!resolve(te[key], o[key])) {
            return false;
          }

          continue;
        }

        return true;
      };

      if (!check(type)) {
        return false;
      }
    } else if (type !== "object") {
      return false;
    }
  }

  return o;
}

export function checkMultipleTypes<T>(
  o: T,
  ...types: Array<TypedFromTypes>
): { value: T | false; tests: Array<boolean> } {
  const tests = [];

  let value: T | false = o;
  for (const type of types) {
    tests.push(!!checkType(o, type));
  }

  if (tests.every((result) => !result)) {
    value = false;
  }

  return {
    value,
    tests,
  };
}
