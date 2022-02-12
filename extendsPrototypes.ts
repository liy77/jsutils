import { join } from "node:path";
import { 
    capitalize, 
    camelCase, 
    startCase, 
    upperFirst, 
    compact, 
    chunk, 
    arrayToIterator, 
    isEmpty, 
    words,
    parse,
    isNumberArray,
    isNilArray,
    isIntegerArray,
    isBufferArray,
    isStringArray,
    isFunctionArray,
    isUndefinedArray,
    isNullArray,
    Parse,
    isRegExpArray,
    isBooleanArray,
    isFalse,
    isTrue,
    isConstructor,
    isConstructorArray,
    ClassType,
    asciiWords,
    unicodeWords,
    hasUnicodeWord,
    extendsClass,
    isMap,
    isSet,
    isWeakMap,
    isWeakSet,
    kebabCase,
    snakeCase,
    clone,
    cloneMultiple,
    extendsMultiple,
    wait,
    waitPromise,
    moveItemsInArray,
    toInteger,
    MemoryUsed,
    ramUsed,
    isEqual,
    CacheMap,
    findWhere,
    CacheMapEntries,
    compare,
    CompareResult,
    random,
    forOwn,
    shuffle,
    overrideCommonJSModule,
    loadCommonJSModule
} from "./src/index"

import * as RegExtensions from "./src/regexp";

declare global {
    function memoryUsage (): MemoryUsed;
    function _override (id: string, filepath: string | null, modify: (mod: any) => any): any;
    function _load (id: string): any;

    const wait: {
        <T> (fn: (...args: Array<T>) => any, time: number, ...args: Array<T>): NodeJS.Timeout;
        promise <T> (time: number, ...args: Array<T>): Promise<Array<T>>;
    }

    const CacheMap: {
        new <K, V>(entries?: Readonly<Array<(Readonly<[K, V]>)>>): CacheMap<K, V>;
        new <K, V>(entries?: Iterable<Readonly<[K, V]>>): CacheMap<K, V>;
        new <K, V>(entries?: CacheMapEntries<K, V>): CacheMap<K, V>;
        new <K, V>(limit?: number, entries?: Readonly<Array<(Readonly<[K, V]>)>>): CacheMap<K, V>
        new <K, V>(limit?: number, entries?: Iterable<Readonly<[K, V]>>): CacheMap<K, V>
        new <K, V>(limit?: number | CacheMapEntries<K, V>, entries?: CacheMapEntries<K, V>): CacheMap<K, V>
        readonly prototype: CacheMap<any, any>;
    }

    namespace NodeJS {
        interface Process {
            memoryUsage (): MemoryUsed;
        }
    }

    interface Number {
        toInteger (): number;
    }

    interface Symbol {
        isEqual <T> (o: T): this is T;
    }

    interface String {
        capitalize (): string;
        toCamelCase (): string;
        toStartCase (): string;
        toKebabCase (): string;
        toSnakeCase (): string;
        upperFirst (): string;
        words (): Array<string>;
        isEmpty (): boolean;
        asciiWords (): RegExpMatchArray;
        unicodeWords (): RegExpMatchArray;
        hasUnicodeWord (): boolean;
        isEqual <T> (o: T): this is T;
        compareTo (str: string): CompareResult;
    }

    interface Array<T> {
        compact (): Array<T>;
        chunk (): Array<Array<T>>;
        toIterator (): IterableIterator<T>;
        isEmpty (): boolean;
        isNilArray (): this is Array<null | undefined>;
        isNullArray (): this is Array<null>;
        isUndefinedArray (): this is Array<undefined>;
        isBufferArray (): this is Array<Buffer>;
        isNumberArray (): this is Array<number>;
        isIntegerArray (): this is Array<number>;
        isStringArray (): this is Array<string>;
        isRegExpArray (): this is Array<RegExp>;
        isBooleanArray (): this is Array<boolean>;
        isConstructorArray (): this is ClassType<T>;
        isEqual <T> (o: T): this is T;
        shuffle (): Array<T>;
        where (query: any): T;
        random (): T;
        forOwn (fn: (value: any, key: string, array: Array<T>) => void): void;
        moveItems (...itensToMove: Array<{
            new: number;
            old: number;
        }>): Array<T>;
    }

    interface Object {
        isEqual <T> (o: T): this is T;
        forOwn (fn: (value: any, key: string, object: this) => void): void;
    }

    interface ObjectConstructor {
        parse <T> (o: T): T & Parse<T>;
        isMap <K = any, V = any> (o: unknown): o is Map<K, V>;
        isWeakMap <K extends object = any, V = any> (o: unknown): o is WeakMap<K, V>;
        isWeakSet <T extends object = any> (o: unknown): o is WeakSet<T>;
        isSet <T = unknown> (o: unknown): o is Set<T>;
        clone <T extends object> (o: T): T;
        objects: {
            clone <T extends object> (...objects: Array<T>): Array<T>;
        }
    }

    interface Boolean {
        isFalse (): this is false;
        isTrue (): this is true;
    }

    interface BooleanConstructor {
        isFalse (o: unknown): o is false;
        isTrue (o: unknown): o is true;
    }

    interface RegExpConstructor {
        AstralRange: RegExp;
        ComboMarksRange: RegExp;
        reComboHalfMarksRange: RegExp;
        ComboSymbolsRange: RegExp;
        ComboMarksExtendedRange: RegExp;
        ComboMarksSupplementRange: RegExp;
        ComboRange: RegExp;
        DingbatRange: RegExp;
        LowerRange: RegExp;
        MathOpRange: RegExp;
        NonCharRange: RegExp;
        PunctuationRange: RegExp;
        SpaceRange: RegExp;
        UpperRange: RegExp;
        VarRange: RegExp;
        BreakRange: RegExp;

        Apos: RegExp;
        Break: RegExp;
        Combo: RegExp;
        Digit: RegExp;
        Dingbat: RegExp;
        Lower: RegExp;
        Misc: RegExp;
        Fitz: RegExp;
        Modifier: RegExp;
        NonAstral: RegExp;
        Regional: RegExp;
        SurrPair: RegExp;
        Upper: RegExp;
        ZWJ: RegExp;

        MiscLower: RegExp;
        MiscUpper: RegExp;
        OptContrLower: RegExp;
        OptContrUpper: RegExp;
        reOptMod: RegExp;
        OptVar: RegExp;
        OptJoin: RegExp;
        OrdLower: RegExp;
        OrdUpper: RegExp;
        Seq: RegExp;
        Emoji: RegExp;

        reUnicodeWords: RegExp;
    }

    interface FunctionConstructor {
        isConstructor (o: unknown): o is ClassType<any>;
        createMultipleInstance <B extends ClassType<any>, M extends Array<ClassType<any>>> (base: B, ...mixins: M): B & M[keyof M];
    }

    interface Function {
        extendsClass (c: ClassType<any>): boolean;
    }
}

const setProperty = (t: Function, name: string, value: any, args?: boolean, fullFn?: boolean) => {
    if (args) {
        t.prototype[name] = fullFn ? value : function (...args: Array<any>) {
            return value(...args);
        }
    }
    else {
        t.prototype[name] = fullFn ? value : function () {
            return value(this);
        }
    }
}

const setStatic = (t: any, name: string, value: any, args?: boolean, fullFn?: boolean) => {
    if (args) {
        t[name] = fullFn ? value : function (...args: Array<any>) {
            return value(...args);
        }
    }
    else {
        t[name] = fullFn ? value : function () {
            return value(this);
        }
    }
}

setProperty(String, "capitalize", capitalize);
setProperty(String, "toCamelCase", camelCase);
setProperty(String, "toStartCase", startCase);
setProperty(String, "toKebabCase", kebabCase);
setProperty(String, "toSnakeCase", snakeCase);
setProperty(String, "upperFirst", upperFirst);
setProperty(String, "words", words);
setProperty(String, "isEmpty", isEmpty);
setProperty(String, "asciiWords", asciiWords);
setProperty(String, "unicodeWords", unicodeWords);
setProperty(String, "hasUnicodeWord", hasUnicodeWord);
setProperty(String, "isEqual", function (o: any) {
    return isEqual(this, o);
}, true, true);
setProperty(String, "compareTo", function (str: string) {
    return compare(this, str);
}, true, true);

setProperty(Array, "compact", compact);
setProperty(Array, "chunk", chunk);
setProperty(Array, "toIterator", arrayToIterator);
setProperty(Array, "isEmpty", isEmpty);
setProperty(Array, "isNilArray", isNilArray);
setProperty(Array, "isNumberArray", isNumberArray);
setProperty(Array, "isStringArray", isStringArray);
setProperty(Array, "isBufferArray", isBufferArray);
setProperty(Array, "isIntegerArray", isIntegerArray);
setProperty(Array, "isFunctionArray", isFunctionArray);
setProperty(Array, "isNullArray", isNullArray);
setProperty(Array, "isUndefinedArray", isUndefinedArray);
setProperty(Array, "isRegExpArray", isRegExpArray);
setProperty(Array, "isBooleanArray", isBooleanArray);
setProperty(Array, "isConstructorArray", isConstructorArray)
setProperty(Array, "random", random);
setProperty(Array, "shuffle", shuffle);
setProperty(Array, "forOwn", function <T> (fn: (value: any, key: string, array: Array<T>) => void) {
    return forOwn(this, fn);
}, true, true);
setProperty(Array, "moveItems", function (...items: Array<any>) {
    return moveItemsInArray(this, ...items);
}, true, true);
setProperty(Array, "isEqual", function (o: any) {
    return isEqual(this, o);
}, true, true);
setProperty(Array, "where", function (query: any) {
    return findWhere(this, query);
}, true, true);

setStatic(Object, "parse", parse, true);
setStatic(Object, "isMap", isMap, true);
setStatic(Object, "isWeakMap", isWeakMap, true);
setStatic(Object, "isSet", isSet, true);
setStatic(Object, "isWeakSet", isWeakSet, true);
setStatic(Object, "clone", clone, true);
setStatic(Object, "objects", {
    clone <T extends object> (...objects: Array<T>): Array<T> {
        return cloneMultiple(...objects);
    }
});
setProperty(Object, "isEqual", function (o: any) {
    return isEqual(this, o);
}, true, true);
setProperty(Object, "forOwn", function (fn: (value: any, key: string, object: object) => void) {
    return forOwn(this, fn);
}, true, true);

setProperty(Boolean, "isFalse", isFalse);
setProperty(Boolean, "istrue", isTrue);
setStatic(Boolean, "isFalse", isFalse, true);
setStatic(Boolean, "isTrue", isTrue), true;

setStatic(Function, "isConstructor", isConstructor, true);
setStatic(Function, "createMultipleInstance", extendsMultiple, true);
setProperty(Function, "extendsClass", function (c: ClassType<any>) {
    return extendsClass(this, c);
}, true, true);
setProperty(Function, "isEqual", function (o: any) {
    return isEqual(this.constructor, o);
}, true, true);


setProperty(Number, "toInteger", toInteger);

setProperty(Symbol, "isEqual", function (o: any) {
    return isEqual(this, o);
}, true, true);

for (const [key, value] of Object.entries(RegExtensions)) {
    RegExp[key] = new RegExp(value);
}

const waiter = wait as any;
waiter.promise = waitPromise;

setStatic(global, "wait", waiter, true, true);
setStatic(global, "memoryUsage", ramUsed);
setStatic(global.process, "memoryUsage", ramUsed);
setStatic(global, "CacheMap", CacheMap, true, true);
setStatic(global, "_override", function (id: any, filepath: null | string, modify: (mod: any) => any) {
    const isNodeModule = () => {
        try {
            require(id);
            return true;
        }
        catch {
            return false;
        }
    }

    return overrideCommonJSModule(isNodeModule() ? id : join(process.cwd(), id), filepath || "/index.js", modify);
}, false, true);
setStatic(global, "_load", loadCommonJSModule, true, true);