import { isObject } from "../misc";

export type AnyObject = Record<any, any>;

export function clone<T extends AnyObject>(o: T): T {
  return cloneMultiple(o)[0];
}

export function cloneMultiple<T extends AnyObject>(...o: Array<T>): Array<T> {
  const cloned = [];
  for (const _o of o) {
    cloned.push(isObject(_o) ? Object.assign(Object.create(_o), _o) : _o);
  }

  return cloned;
}
