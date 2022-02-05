import type EventEmitter from "node:events";
import type { Stream } from "node:stream";
import { URL } from "node:url";
import { reUnicodeWords } from "./regexp";

export type ClassType<T, Keys extends Array<any> = Array<any>> = new (...args: Keys) => T;
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

export function isString (o: unknown): o is string {
    return o && typeof o === "string";
}

export function isFunction (o: unknown): o is Function {
    return o && typeof o === "function";
}

export function isObject (o: unknown): o is object {
    return o && typeof o === "object";
}

export function isNull (o: unknown): o is null {
    return !o && typeof o === "object" && o === null;
}

export function isUndefined (o: unknown): o is undefined {
    return !o && typeof o === "undefined";
}

export function isNumber (o: unknown): o is number {
    return o && typeof o === "number";
}

export function isBigInt (o: unknown): o is bigint {
    return o && typeof o === "bigint";
}

export function isBoolean (o: unknown): o is boolean {
    return typeof o === "boolean";
}

export function isTrue (o: unknown): o is true {
    return o && typeof o === "boolean";
}

export function isFalse (o: unknown): o is false {
    return !o && typeof o === "boolean";
}

export function isInteger (o: unknown): o is number {
    return isNumber(o) && Number.isInteger(o);
}

export function isArray (o: unknown): o is Array<any> {
    return o && Array.isArray(o);
}

export function isObjectArray (o: unknown): o is Array<object> {
    return isArray(o) && o.every(isObject);
}

export function isStringArray (o: unknown): o is Array<string> {
    return isArray(o) && o.every(isString);
}

export function isNumberArray (o: unknown): o is Array<number> {
    return isArray(o) && o.every(isNumber);
}

export function isFunctionArray (o: unknown): o is Array<Function> {
    return isArray(o) && o.every(isFunction);
}

export function isNullArray (o: unknown): o is Array<null> {
    return isArray(o) && o.every(isNull);
}

export function isUndefinedArray (o: unknown): o is Array<undefined> {
    return isArray(o) && o.every(isUndefined);
}

export function isBigIntArray (o: unknown): o is Array<bigint> {
    return isArray(o) && o.every(isBigInt);
}

export function isIntegerArray (o: unknown): o is Array<number> {
    return isArray(o) && o.every(isInteger);
}

export function isBiggerThen (o: unknown, o2: unknown): boolean {
    return isNumber(o) && isNumber(o2) && o > o2;
}

export function isLessThen (o: unknown, o2: unknown): boolean {
    return isNumber(o) && isNumber(o2) && o < o2;
}

export function isConstructor <T = any> (o: unknown): o is ClassType<T> {
    return isFunction(o) && !!o.prototype.constructor;
}

export function extendsClass (o: unknown, o2: unknown): boolean {
    return isConstructor(o) && isConstructor(o2) && o.prototype instanceof o2;
}

export function isEnumerable (o: unknown): o is object {
    return isObject(o) && Object.entries(o).every(([k, v]) => {
        if (isNumber(Number(k)) && isString(v)) {
            return true;
        }
        else if (isString(k) && isNumber(v)) {
            return true;
        }
        else {
            return false;
        }
    });
}

export function isEnumerableArray (o: unknown): o is Array<object> {
    return isArray(o) && o.every(isEnumerable);
}

export function isConstructorArray <T = any> (o: unknown): o is Array<ClassType<T>> {
    return isArray(o) && o.every(isConstructor);
}

export function isBooleanArray (o: unknown): o is Array<boolean> {
    return isArray(o) && o.every(isBoolean);
}

export function isSymbol (o: unknown): o is symbol {
    return o && typeof o === "symbol";
}

export function isSymbolArray (o: unknown): o is Array<symbol> {
    return isArray(o) && o.every(isSymbol);
}

export function isURL (o: unknown): o is URL {
    if (isString(o)) {
        try {
            o = new URL(o);
        }
        catch {
            return false;
        }
    }

    return instanceOf(o, URL);
}

export function isURLArray (o: unknown) {
    return isArray(o) && o.every(isURL);
}

export function instanceOf (o: unknown, o2: unknown): boolean {
    return o && isFunction(o2) && o instanceof o2;
}

export function moveItemInArray <T = any> (arr: Array<T>, oldIndex: number, newIndex: number): Array<T> {
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
};

export function isBufferArray (o: unknown): o is Array<Buffer> {
    return isArray(o) && o.every(isBuffer);
}

export function isNilArray (o: unknown): o is Array<null | undefined> {
    return isArray(o) && o.every(isNil);
}

export function moveItemsInArray <T = any> (arr: Array<T>, ...itemsToMove: Array<{ new: number, old: number }>): Array<T> {
    for (const item of itemsToMove) {
        arr = moveItemInArray<T>(arr, item.old, item.new);
    }

    return arr;
}

export function createEnumerable (arr: Array<{ key: string | number, value: number | string }>): { [x: string]: number | string } {
    const enumerable = {};

    for (const { key, value } of arr) {
        if (!key && key !== 0 || !value) {
            continue;
        }

        enumerable[key] = value;
        enumerable[value] = key;
    }

    return enumerable;
}

export function extendsMultiple <B extends ClassType<any>, M extends Array<ClassType<any>>> (baseClass: B, ...mixins: M): B & M[keyof M] {
    class MultipleInstance extends baseClass {
        constructor (...args: Array<any>) {
            super(...args);

            for (const mixin of mixins) {
                copyProps(this, (new mixin));
            }
        }
    }

    function copyProps (target: any, source: any) {
        Object.getOwnPropertyNames(source)
              .concat(Object.getOwnPropertyNames(source))
              .forEach((prop) => {
                 if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
               })
    }
    
    for (const mixin of mixins) {
        copyProps(MultipleInstance.prototype, mixin.prototype);
        copyProps(MultipleInstance, mixin);
    }

    return MultipleInstance as B & M[keyof M];
}

export function clone <T extends object> (o: T): T {
    return cloneMultiple(o)[0];
}

export function cloneMultiple <T extends object> (...o: Array<T>): Array<T> {
    const cloned = [];
    for (const _o of o) {
        cloned.push(isObject(_o) ? Object.assign(Object.create(_o), _o) : _o);
    }

    return cloned;
}

export function isBuffer (o: unknown): o is Buffer {
    return o && Buffer.isBuffer(o);
}

export function isDate (o: unknown): o is Date {
    return o && instanceOf(o, Date);
}

export function isSet <T = unknown> (o: unknown): o is Set<T> {
    return o && instanceOf(o, Set);
}

export function isMap <K = string, V = unknown> (o: unknown): o is Map<K, V> {
    return o && instanceOf(o, Map);
}

export function isWeakMap <K extends object = any, V = unknown> (o: unknown): o is WeakMap<K, V> {
    return o && instanceOf(o, WeakMap);
}

export function isWeakSet <T extends object = any> (o: unknown): o is WeakSet<T> {
    return o && instanceOf(o, WeakSet);
}

export function isWeakRef <T extends object = any> (o: unknown): o is WeakRef<T> {
    return o && instanceOf(o, WeakRef);
}

export function isAbortController (o: unknown): o is AbortController {
    return o && instanceOf(o, AbortController);
}

export function isEventEmitter (o: unknown): o is EventEmitter {
    return o && isFunction(o) && o.name === "EventEmitter";
}

export function isNil (o: unknown): o is (null | undefined) {
    return isNull(o) || isUndefined(o);
}

export function isEmpty (o: unknown): boolean {
    if (isString(o)) {
        return o === "";
    }
    else if (isNumber(o)) {
        return o === 0;
    }
    else if (isArray(o)) {
        return !o.length;
    }

    return !isObject(o) && !isArray(o) && !isBuffer(o);
}

export function wait <T  extends Array<T>> (fn: (...args: T) => any, time: number, ...args: T): NodeJS.Timeout {
    return setTimeout(fn, time, ...args);
}

export function waitPromise <T extends Array<T>> (time: number, ...args: T): Promise<T> {
    return new Promise((resolve) => setTimeout((...args) => resolve(args), time, ...args)
    );
}

export function createMathOperation (fn: (first: number, second: number) => number, defaultValue = 1): (value1: number, value2: number) => number {
    return (value1: number, value2: number) => {
        const v1NoU = isUndefined(value1) || isNull(value1);
        const v2NoU = isUndefined(value2) || isNull(value2);

        value1 = Number(value1);
        value2 = Number(value2);

        if (v1NoU && v2NoU) {
            return defaultValue;
        }
        else if (!v1NoU && v2NoU) {
            return value2;
        }
        else if (v1NoU && !v2NoU) {
            return value1;
        }

        return fn(value1, value2);
    }
}

export function iteratorToArray <T> (iterator: IterableIterator<T>, length?: number): Array<T> {
    if (!isObject(iterator)) {
        return [];
    }

    if (length) {
        return Array.from({ length }, () => iterator.next().value);
    }
    else {
        return [...iterator];
    }
}

export function arrayToIterator <T> (arr: Array<T>) {
    if (!isArray(arr)) {
        return [].entries();
    }

    return arr.entries();
}

export function toInteger (o: unknown) {
    o = Number(o);

    if (!isNumber(o)) {
        return 0;
    }

    return Math.round(o);
}

export function chunk <T extends Array<any>> (arr: T, size: number): Array<T> {
    const chunk = [];
    size = Math.max(toInteger(size));

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

isHttps("https://discord.com")

export function isHttps (url: string | URL): boolean {
    if (!isURL(url)) {
        return false;
    }

    if (isString(url)) {
        url = new URL(url);
    }

    return url.protocol === "https:";
}

export function isHttp (url: string | URL): boolean {
    if (!isURL(url)) {
        return false;
    }

    if (isString(url)) {
        url = new URL(url);
    }

    return url.protocol === "http:";
}

export function isStream (o: unknown): o is Stream {
    let _o = o as any;
    return isObject(o) && isFunction(_o.pipe);
}

export function compact <T> (arr: Array<T>): Array<T> {
    return arr.filter((value) => !isNil(value) && !isFalse(value) && !isEmpty(value));
}

export function upperFirst(str: string): string {
    if (!isString(str)) {
        return "";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalize (str: string): string {
    str = str.toLowerCase();
    return upperFirst(str);
}

export function words (str: string, pattern?: RegExp): RegExpMatchArray {
    if (!isString(str)) {
        return [];
    }

    if (pattern && isRegExp(str)) {
        return str.match(pattern);
    }

    return (hasUnicodeWord(str) ? unicodeWords(str) : asciiWords(str)) || [];
}

export function camelCase (str: string): string {
    return words(str.replaceAll(/['\u2019]/g, "")).map((v, index) => {
        if (index) {
            return capitalize(v.toLowerCase());
        }

        return v.toLowerCase();
    }).join("");
}

export function startCase (str: string): string {
    return words(str.replaceAll(/['\u2019]/g, "")).map(upperFirst).join(" ");
}

export function hasUnicodeWord (str: string): boolean {
    return /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-z0-9 ]/.test(isString(str) ? str : "");
}

export function asciiWords (str: string): RegExpMatchArray {
    str = isString(str) ? str : "";
    return str.match(/[^\x00-\x2ff\x3a-\x40\x5b-\x60\x7b-\x7f]+/g);
}

export function unicodeWords (str: string): RegExpMatchArray {
    str = isString(str) ? str : "";
    return str.match(reUnicodeWords);
}

export function isRegExp (o: unknown): o is RegExp {
    return o && instanceOf(o, RegExp);
}

export function isRegExpArray (o: unknown): o is Array<RegExp> {
    return isArray(o) && o.every(isRegExp);
}

export function kebabCase (str: string) {
    return words(str.replaceAll(/['\u2019]/g, "")).map((str) => str.toLowerCase()).join("-");
}

export function snakeCase (str: string) {
    return words(str.replaceAll(/['\u2019]/g, "")).map((str) => str.toLowerCase()).join("_");
}

/**
 * Parse a object
 * 
 * ```
 * +-------------------------+
 * |        WARNING          |
 * | args paramenter is only | 
 * |    necessary if o is    | 
 * |     a custom class      |
 * +-------------------------+
 * ```
 */
 export function parse <T> (o: T, ...args: Array<string>): Parse<T> & T {
    let Parsed: ClassType<any>;

    if (isArray(o)) {
        const arr = o;

        Parsed = class extends extendsMultiple(Array, Parse) {
            _o: T;
            constructor() {
                super(...arr);
                this._o = o;
            }
        }
        
        return new Parsed();
    }
    else if (isObject(o)) {
        Parsed = class extends extendsMultiple(Object, Parse) {
            _o: T;
            constructor() {
                super(o);
                this._o = o;
            }
        }
    }
    else if (isNumber(o)) {
        Parsed = class extends extendsMultiple(Number, Parse) {
            _o: T;
            constructor() {
                super(o);
                this._o = o;
            }        
        }
    }
    else if (isString(o)) {
        Parsed = class extends extendsMultiple(String, Parse) {
            _o: T;
            constructor() {
                super(o);
                this._o = o;
            }        
        }
    }
    else if (isBoolean(o)) {
        Parsed = class extends extendsMultiple(Boolean, Parse) {
            _o: T;
            constructor() {
                super(o);
                this._o = o;
            }        
        }
    }
    else if (isURL(o)) {
        Parsed = class extends extendsMultiple(URL, Parse) {
            _o: T;
            constructor() {
                super(o);
                this._o = o;
            }        
        }
    }
    else if (isConstructor(o)) {
        Parsed = class extends extendsMultiple(o, Parse) {
            _o: T;
            constructor (...args: Array<any>) {
                super(...args);
                this._o = o;
            }
        }
    }

    return new Parsed(...args);
}

export type TypedFromTypes = Type | `Array<${Type}>` | { [x: string]: Type | `Array<${Type}>` };

export function checkType <T> (o: T, type: TypedFromTypes): T | false {
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
            "Array<nil>": isNilArray(_o)
        }

        return ob[t];
    }

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
            } 

            if (!check(type)) {
                return false;
            };
        }
        else if (type !== "object") {
            return false;
        }
    }

    return o;
}

export function checkMultipleTypes <T> (o: T, ...types: Array<TypedFromTypes>): { value: T | false, tests: Array<boolean> } {
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
        tests
    }
}

export class Parse<T> {
    private readonly _o: T;
    constructor (o: T) {
        Object.defineProperty(this, "_o", {
            value: o
        })
    }

    public isString (): this is string {
        return isString(this._o);
    }

    public isNumber (): this is number {
        return isNumber(this._o);
    }

    public isConstructor <T = any> (): this is ClassType<T> {
        return isConstructor(this._o);
    }

    public isEnumerable (): this is object {
        return isEnumerable(this._o);
    }

    public isUndefined (): this is undefined {
        return isUndefined(this._o);
    }

    public isNull (): this is null {
        return isNull(this._o);
    }

    public isInteger (): this is number {
        return isInteger(this._o);
    }

    public isBiggerThen (t: number): boolean {
        return isBiggerThen(this._o, t);
    }

    public isLessThen (t: number): boolean {
        return isLessThen(this._o, t);
    }

    public isObject (): this is object {
        return isObject(this._o);
    }

    public isBigInt (): this is bigint {
        return isBigInt(this._o);
    }

    public isFunction (): this is Function {
        return this.isFunction();
    }

    public isTrue (): this is true {
        return isTrue(this._o);
    }

    public isFalse (): this is false {
        return isFalse(this._o);
    }
    
    public isURL (): this is URL {
        return isURL(this._o);
    }

    public extends <T = any> (c: ClassType<T>): boolean {
        return extendsClass(this._o, c);
    }

    public instanceOf <T extends Function> (t: T): this is T {
        return instanceOf(this._o, t);
    }

    public isSymbol (): this is symbol {
        return isSymbol(this._o);
    }

    public isRegExp (): this is RegExp {
        return isRegExp(this._o);
    }

    public isBuffer (): this is Buffer {
        return isBuffer(this._o);
    }

    public isNil (): this is (null | undefined) {
        return isNil(this._o);
    }

    public isStream (): this is Stream {
        return isStream(this._o);
    }
 
    public isArray (type?: Type): this is Array<any>
    public isArray (type: "number"): this is Array<number>
    public isArray (type: "enumerable"): this is Array<object>
    public isArray (type: "bigint"): this is Array<bigint>
    public isArray (type: "undefined"): this is Array<undefined>
    public isArray (type: "null"): this is Array<null>
    public isArray (type: "object"): this is Array<object>
    public isArray (type: "integer"): this is Array<number>
    public isArray (type: "boolean"): this is Array<boolean>
    public isArray (type: "string"): this is Array<string>
    public isArray (type: "function"): this is Array<Function>
    public isArray (type: "any"): this is Array<any>
    public isArray (type: "url"): this is Array<URL>
    public isArray (type: "symbol"): this is Array<symbol>
    public isArray (type: "buffer"): this is Array<Buffer>
    public isArray (type: "nil"): this is Array<null | undefined>
    public isArray (type: "regexp"): this is Array<RegExp>
    public isArray <T = any> (type: "constructor"): this is Array<ClassType<T>>
    public isArray (type: Type = "any"): this is Array<any> {
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
            regexp: isRegExpArray(this._o)
        }

        return isArrayType[type];
    }

    get value (): unknown {
        return this._o;
    }
}

interface Memory {
    gigabytes: number;
    megabytes: number;
    kilobytes: number;
    bytes: number;
};

export interface MemoryUsed {
    rss: Memory;
    external: Memory;
    heapUsed: Memory;
    heapTotal: Memory;
    arrayBuffers: Memory;
    total: Memory;
}

const oldMemoryUsage = process.memoryUsage;

export function ramUsed (): MemoryUsed {
    const ramUsed = {} as MemoryUsed;

    for (const key of Object.keys(oldMemoryUsage())) {
        const mem = toInteger(oldMemoryUsage()[key]);
    
        ramUsed[key] = {
            gigabytes: mem / (1024 * 1024 * 1024),
            megabytes: mem / (1024 * 1024),
            kilobytes: mem / 1024,
            bytes: mem
        };
    }
    
    const totalMem = 
    ramUsed.heapTotal.bytes    | 
    ramUsed.external.bytes     | 
    ramUsed.heapUsed.bytes     | 
    ramUsed.arrayBuffers.bytes | 
    ramUsed.rss.bytes;
    
    ramUsed.total = {
        gigabytes: totalMem / (1024 * 1024 * 1024),
        megabytes: totalMem / (1024 * 1024),
        kilobytes: totalMem / 1024,
        bytes: totalMem
    };

    return ramUsed;
}

export function isEqual (o1: unknown, o2: unknown): boolean {
    const equalObject = (t: any) => ([key, value]: [string, any]) => isEqual(value, t[key]);
    const equalArray = (t: any) => (value: any, index: number) => isEqual(value, t[index]);

    if (o1 === o2) {
        return true;
    }

    if (isArray(o1) && isArray(o2)) {
        return o1.every(equalArray(o2)) && o2.every(equalArray(o1));
    }

    if (isMap(o1) && isMap(o2)) {
        return iteratorToArray(o1.entries()).every(equalObject(o2))
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
        return Object.entries(o1).every(equalObject(o2)) && Object.entries(o2).every(equalObject(o1));
    }

    return false;
}

export enum CompareDifferenceTypes {
    MISSING = 1,
    NOT_EQUAL = 2,
    NO_ORDER = 3,
    WORD_ADDED = 4,
    NO_LENGTH = 5
}

export interface CompareResult {
    accuracy: number;
    differences: Array<{
        type: CompareDifferenceTypes;
        correct: string | number;
        incorrect: string | number;
        index: number;
    }>
}

export function compare (str1: string, str2: string): CompareResult {
    let equality = 0;
    const differences = [];
    const map = new Map();

    if (isEqual(str1, str2)) {
        return {
            accuracy: 0,
            differences
        };    
    }
    
    if (isLessThen(str1.length, 2) || isLessThen(str2.length, 2)) {
        return {
            accuracy: 0,
            differences: [{ correct: str1.length, incorrect: str2.length, type: CompareDifferenceTypes.NO_LENGTH, index: 0 }]
        };
    }

    for (let i = 0; i < str1.length; i++) {
        const sub = str1.substring(i, i + 2);

        const count = (map.get(sub) ?? 0) + 1;

        map.set(sub, count);
    }

    for (let i = 0; i < str2.length; i++) {
        const sub = str2.substring(i, i + 2);

        const count = map.get(sub) ?? 0;

        if (count) {
            map.set(sub, count - 1);
            equality++;
        }
    }

    if (isBiggerThen(str1.length, str2.length)) {
        differences.push({ correct: str1, incorrect: str1.substring(str2.length), type: CompareDifferenceTypes.WORD_ADDED });
    }
    else if (isBiggerThen(str2.length, str1.length)) {
        differences.push({ correct: str1, incorrect: str2.substring(str1.length), type: CompareDifferenceTypes.WORD_ADDED });
    }

    const [s1, s2] = [str1.split(" ").map((str, index) => ({ value: str, index })), str2.split(" ").map((str, index) => ({ value: str, index }))];

    for (let i = 0; i < s1.length; i++) {
        if (!isEqual(s1[i].value, s2[i].value)) {
            const whered = s2.where({ value: s1[i].value });
            if (whered) {
                const dObj = {
                    type: CompareDifferenceTypes.NO_ORDER,
                    correct: { word: s1[i].value, index: i },
                    incorrect: { word: whered.value, index: whered.index }
                }

                differences.push(dObj);
            }
            else {
                const dObj = {
                    correct: { word: s1[i].value, index: i },
                    incorrect: {},
                    type: CompareDifferenceTypes.NOT_EQUAL
                }

                if (s2[i]) {
                    dObj.incorrect = { word: s2[i].value, index: i }
                }
                else {
                    dObj.type = CompareDifferenceTypes.MISSING;
                    dObj.incorrect = { word: s1[i].value, index: i }
                }

                differences.push(dObj);
            }
        }
    }

    return {
        accuracy: (equality * 2) / (str1.length + str2.length - 2),
        differences
    }
}

export type CacheMapEntries<K, V> = Readonly<Array<(Readonly<[K, V]>)>> | Iterable<Readonly<[K, V]>>;

export class CacheMap<K, V> extends Map<K, V> {
    public readonly limit: number;

    constructor (entries?: CacheMapEntries<K, V>);
    constructor (entries?: Readonly<Array<(Readonly<[K, V]>)>>);
    constructor (entries?: Iterable<Readonly<[K, V]>>);
    constructor (limit?: number, entries?: Readonly<Array<(Readonly<[K, V]>)>>);
    constructor (limit?: number, entries?: Iterable<Readonly<[K, V]>>);
    constructor (limit?: number | CacheMapEntries<K, V>, entries?: CacheMapEntries<K, V>) {
        if (!isNumber(Number(limit))) {
            entries = limit as CacheMapEntries<K, V>;
            limit = Infinity;
        }

        super(entries);

        this.limit = Number(limit);
    }

    public set (key: K, value: V): this {
        super.set(key, value);

        if (this.size > this.limit) {
            while (this.size > this.limit) {
                this.delete(this.keys().next().value);
            }
        }

        return this;
    }

    public forEach (fn: (value: V, key: K, cache: CacheMap<K, V>) => void): void {
        for (const [key, value] of this.entries()) {
            fn(value, key, this);
        }
    }

    public filter (fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean): CacheMap<K, V> {
        const filteredCache = new CacheMap<K, V>(this.limit);

        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                filteredCache.set(key, value);
            }
        }

        return filteredCache;
    }

    public find (fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean): [K, V] | undefined {
        for (const [key, value] of this) {
            if (fn(value, key, this)) {
                return [key, value];
            }
        }

        return undefined;
    }

    public every (fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean): boolean {
        return iteratorToArray(this.entries()).every(([key, value]) => fn(value, key, this));
    }

    public some (fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean): boolean {
        return iteratorToArray(this.entries()).some(([key, value]) => fn(value, key, this));
    }

    public map <MK, MV> (fn: (value: V, key: K, cache: CacheMap<K, V>) => { key: MK, value: MV }): CacheMap<MK, MV> {
        const mapedCachedMap = new CacheMap<MK, MV>(this.limit);

        for (const [key, value] of this) {
            const e = fn(value, key, this);

            if (isObject(e) && "key" in e && "value" in e) {
                mapedCachedMap.set(e.key, e.value);
            }
        }

        return mapedCachedMap;
    }

    public first (): V
    public first (amount?: number): Array<V>
    public first (amount?: number): V | Array<V> {
        if (isBiggerThen(amount, 0)) {
            amount = Math.min(this.size, amount);

            const arr = iteratorToArray(this.values(), amount);

            return isBiggerThen(amount, this.limit) ? arr.splice(this.limit, amount) : arr;
        }
        else if (isLessThen(amount, 0)) {
            return this.last(amount * -1);
        }

        return this.values().next().value;
    }

    public last (): V;
    public last (amount?: number): Array<V>;
    public last (amount?: number): V | Array<V> {
        const arr = iteratorToArray(this.values());

        if (isLessThen(amount, 0)) {
            return this.first(amount * -1)
        }
        else if (amount || amount === 0) {
            return arr.slice(-amount);
        }

        return arr[arr.length - 1];
    }

    public at (index: number): V {
        index = Math.floor(index);

        const arr = iteratorToArray(this.values());

        return arr.at(index);
    }

    public reverse (): CacheMap<K, V> {
        return new CacheMap(this.limit, iteratorToArray(this.entries()).reverse());
    }

    public indexOf (value: V): number {
        const arr = iteratorToArray(this.values());
        return arr.indexOf(value);
    }

    public keyOf (value: V): K | undefined {
        const indexOf = this.indexOf(value);
        const arr = iteratorToArray(this.keys());

        return arr[indexOf];
    }

    public sweep (fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean): number {
        const previousSize = this.size;

        for (const [key, value] of this) {
            if (fn(value, key, this)) {
                this.delete(key);
            }
        }

        return previousSize - this.size;
    }

    public partition (fn: (value: V, key: K, cache: CacheMap<K, V>) => boolean): [CacheMap<K, V>, CacheMap<K, V>] {
        const [cachedTrue, cachedFalse] = [new CacheMap<K, V>(), new CacheMap<K, V>()];
        
        for (const [key, value] of this) {
            if (fn(value, key, this)) {
                cachedTrue.set(key, value);
            }
            else {
                cachedFalse.set(key, value);
            }
        }

        return [cachedTrue, cachedFalse];
    }

    public where <T> (query: T): [K, V] | undefined {
        const whered = findWhere([...this.values()], query);

        if (whered) {
            const key = this.keyOf(whered);
            return [key, whered];
        }

        return undefined;
    }
}

export function findWhere <T> (arr: Array<T>, query: any): T | undefined {
    const typeOf = typeof query;

    return arr.filter((v) => typeof v === typeOf).find((v) => {
        function resolve (q = query, v_ = v) {
            if (typeof q !== "object" && typeof v_ !== "object") {
                return q === v_;
            }
            else if (v_ && typeof v_ === "object") {
                const queryEntries = Object.entries(q);

                for (const [K, V] of queryEntries) {
                    const value = v_[K];
                    const typeOfV = typeof V;

                    if (typeof value === typeOfV) {
                        if (typeof value === "object" && typeOfV === "object" && value !== V) {
                            return resolve(V, value);
                        }

                        return value === V;
                    }
                }
            }
            else {
                return false;
            }
        }

        return resolve();
    });
}

export function bind <T extends Function> (thisArg: any, fn: T): T {
    if (!isFunction(fn)) {
        throw new TypeError("Binding: fn must be a function, but received " + typeof fn);
    }

    return fn.bind(thisArg);
}

export function call <T extends (...args: Array<any>) => any> (thisArg: any, fn: T, ...args: Array<any>): ReturnType<T> {
    if (!isFunction(fn)) {
        throw new TypeError("Binding: fn must be a function, but received " + typeof fn);
    }

    return fn.call(thisArg, ...args);
}

export function isIterator (o: unknown) {
    return isObject(o) && Symbol.iterator in o;
}

export function random <T> (arr?: Array<T>): number | T | undefined {
    if (isArray(arr)) {
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    return Math.random();
}

export function forOwn <T extends object> (o: T, fn: (value: any, key: string, object: T) => void): void {
    if (!isObject(o)) {
        return;
    }
    
    for (const key of Object.keys(o)) {
        fn(o[key], key, o);
    }
}

export function shuffle <T extends Array<T>> (arr: T) {
    if (!isArray(arr)) {
        return [];
    }

    let r = arr.length, t: any, i: number;

    while (r) {
        i = Math.floor(Math.random() * r--);

        t = arr[r];
        arr[r] = arr[i]
        arr[i] = t;
    }

    return arr;
}

export * from "./regexp.js";

interface WeakRef<T extends object> {
    readonly [Symbol.toStringTag]: "WeakRef";

    /**
     * Returns the WeakRef instance's target object, or undefined if the target object has been
     * reclaimed.
     */
    deref(): T | undefined;
}