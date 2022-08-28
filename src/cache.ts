import { findWhere } from "./array";
import {
  isNumber,
  iteratorToArray,
  isObject,
  isBiggerThen,
  isLessThen,
} from "./misc";

export type CacheMapEntries<K, V> =
  | Readonly<Array<Readonly<[K, V]>>>
  | Iterable<Readonly<[K, V]>>;

export class CacheMap<K, V> extends Map<K, V> {
  public readonly limit: number;

  constructor(entries?: CacheMapEntries<K, V>);
  constructor(entries?: Readonly<Array<Readonly<[K, V]>>>);
  constructor(entries?: Iterable<Readonly<[K, V]>>);
  constructor(limit?: number, entries?: Readonly<Array<Readonly<[K, V]>>>);
  constructor(limit?: number, entries?: Iterable<Readonly<[K, V]>>);
  constructor(
    limit?: number | CacheMapEntries<K, V>,
    entries?: CacheMapEntries<K, V>
  ) {
    if (!isNumber(Number(limit))) {
      entries = limit as CacheMapEntries<K, V>;
      limit = Infinity;
    }

    super(entries);

    this.limit = Number(limit);
  }

  public set(key: K, value: V): this {
    super.set(key, value);

    if (this.size > this.limit) {
      while (this.size > this.limit) {
        this.delete(this.keys().next().value);
      }
    }

    return this;
  }

  public forEach(fn: (value: V, key: K, cache: CacheMap<K, V>) => void): void {
    for (const [key, value] of this.entries()) {
      fn(value, key, this);
    }
  }

  public filter(
    fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean
  ): CacheMap<K, V> {
    const filteredCache = new CacheMap<K, V>(this.limit);

    for (const [key, value] of this.entries()) {
      if (fn(value, key, this)) {
        filteredCache.set(key, value);
      }
    }

    return filteredCache;
  }

  public find(
    fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean
  ): [K, V] | undefined {
    for (const [key, value] of this) {
      if (fn(value, key, this)) {
        return [key, value];
      }
    }

    return undefined;
  }

  public every(
    fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean
  ): boolean {
    return iteratorToArray(this.entries()).every(([key, value]) =>
      fn(value, key, this)
    );
  }

  public some(
    fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean
  ): boolean {
    return iteratorToArray(this.entries()).some(([key, value]) =>
      fn(value, key, this)
    );
  }

  public map<MK, MV>(
    fn: (value: V, key: K, cache: CacheMap<K, V>) => { key: MK; value: MV }
  ): CacheMap<MK, MV> {
    const mapedCachedMap = new CacheMap<MK, MV>(this.limit);

    for (const [key, value] of this) {
      const e = fn(value, key, this);

      if (isObject(e) && "key" in e && "value" in e) {
        mapedCachedMap.set(e.key, e.value);
      }
    }

    return mapedCachedMap;
  }

  public first(): V;
  public first(amount?: number): Array<V>;
  public first(amount?: number): V | Array<V> {
    if (isBiggerThen(amount, 0)) {
      amount = Math.min(this.size, amount);

      const arr = iteratorToArray(this.values(), amount);

      return isBiggerThen(amount, this.limit)
        ? arr.splice(this.limit, amount)
        : arr;
    } else if (isLessThen(amount, 0)) {
      return this.last(amount * -1);
    }

    return this.values().next().value;
  }

  public last(): V;
  public last(amount?: number): Array<V>;
  public last(amount?: number): V | Array<V> {
    const arr = iteratorToArray(this.values());

    if (isLessThen(amount, 0)) {
      return this.first(amount * -1);
    } else if (amount || amount === 0) {
      return arr.slice(-amount);
    }

    return arr[arr.length - 1];
  }

  public at(index: number): V {
    index = Math.floor(index);

    const arr = iteratorToArray(this.values());

    return arr.at(index);
  }

  public reverse(): CacheMap<K, V> {
    return new CacheMap(this.limit, iteratorToArray(this.entries()).reverse());
  }

  public indexOf(value: V): number {
    const arr = iteratorToArray(this.values());
    return arr.indexOf(value);
  }

  public keyOf(value: V): K | undefined {
    const indexOf = this.indexOf(value);
    const arr = iteratorToArray(this.keys());

    return arr[indexOf];
  }

  public sweep(
    fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean
  ): number {
    const previousSize = this.size;

    for (const [key, value] of this) {
      if (fn(value, key, this)) {
        this.delete(key);
      }
    }

    return previousSize - this.size;
  }

  public partition(
    fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean
  ): [CacheMap<K, V>, CacheMap<K, V>] {
    const [cachedTrue, cachedFalse] = [
      new CacheMap<K, V>(),
      new CacheMap<K, V>(),
    ];

    for (const [key, value] of this) {
      if (fn(value, key, this)) {
        cachedTrue.set(key, value);
      } else {
        cachedFalse.set(key, value);
      }
    }

    return [cachedTrue, cachedFalse];
  }

  public where<T>(query: T): [K, V] | undefined {
    const whered = findWhere([...this.values()], query);

    if (whered) {
      const key = this.keyOf(whered);
      return [key, whered];
    }

    return undefined;
  }
}
