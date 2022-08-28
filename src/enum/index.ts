import {
    isObject,
    isNumber,
    isString
} from "../misc";

export function isEnumerable(o: unknown): o is object {
  return (
    isObject(o) &&
    Object.entries(o).every(([k, v]) => {
      if (isNumber(Number(k)) && isString(v)) {
        return true;
      } else if (isString(k) && isNumber(v)) {
        return true;
      } else {
        return false;
      }
    })
  );
}

export function createEnumerable(
  arr: Array<{ key: string | number; value: number | string }>
): { [x: string]: number | string } {
  const enumerable = {};

  for (const { key, value } of arr) {
    if ((!key && key !== 0) || !value) {
      continue;
    }

    enumerable[key] = value;
    enumerable[value] = key;
  }

  return enumerable;
}