import { isBiggerThen, isEqual, isLessThen, isRegExp, isString } from "../misc";
import { reUnicodeWords } from "../regexp";

export function upperFirst(str: string): string {
  if (!isString(str)) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalize(str: string): string {
  str = str.toLowerCase();
  return upperFirst(str);
}

export function words(str: string, pattern?: RegExp): RegExpMatchArray {
  if (!isString(str)) {
    return [];
  }

  if (pattern && isRegExp(str)) {
    return str.match(pattern);
  }

  return (hasUnicodeWord(str) ? unicodeWords(str) : asciiWords(str)) || [];
}

export function camelCase(str: string): string {
  return words(str.replaceAll(/['\u2019]/g, ""))
    .map((v, index) => {
      if (index) {
        return capitalize(v.toLowerCase());
      }

      return v.toLowerCase();
    })
    .join("");
}

export function startCase(str: string): string {
  return words(str.replaceAll(/['\u2019]/g, ""))
    .map(upperFirst)
    .join(" ");
}

export function hasUnicodeWord(str: string): boolean {
  return /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/.test(
    isString(str) ? str : ""
  );
}

export function asciiWords(str: string): RegExpMatchArray {
  str = isString(str) ? str : "";
  return str.match(/[^\x00-\x2ff\x3a-\x40\x5b-\x60\x7b-\x7f]+/g);
}

export function unicodeWords(str: string): RegExpMatchArray {
  str = isString(str) ? str : "";
  return str.match(reUnicodeWords);
}

export function kebabCase(str: string) {
  return words(str.replaceAll(/['\u2019]/g, ""))
    .map((str) => str.toLowerCase())
    .join("-");
}

export function snakeCase(str: string) {
  return words(str.replaceAll(/['\u2019]/g, ""))
    .map((str) => str.toLowerCase())
    .join("_");
}

export enum CompareDifferenceTypes {
  MISSING = 1,
  NOT_EQUAL = 2,
  NO_ORDER = 3,
  WORD_ADDED = 4,
  NO_LENGTH = 5,
}

export interface CompareResult {
  accuracy: number;
  differences: Array<{
    type: CompareDifferenceTypes;
    correct: string | number;
    incorrect: string | number;
    index: number;
  }>;
}

export function compare(str1: string, str2: string): CompareResult {
  let equality = 0;
  const differences = [];
  const map = new Map();

  if (isEqual(str1, str2)) {
    return {
      accuracy: 0,
      differences,
    };
  }

  if (isLessThen(str1.length, 2) || isLessThen(str2.length, 2)) {
    return {
      accuracy: 0,
      differences: [
        {
          correct: str1.length,
          incorrect: str2.length,
          type: CompareDifferenceTypes.NO_LENGTH,
          index: 0,
        },
      ],
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
    differences.push({
      correct: str1,
      incorrect: str1.substring(str2.length),
      type: CompareDifferenceTypes.WORD_ADDED,
    });
  } else if (isBiggerThen(str2.length, str1.length)) {
    differences.push({
      correct: str1,
      incorrect: str2.substring(str1.length),
      type: CompareDifferenceTypes.WORD_ADDED,
    });
  }

  const [s1, s2] = [
    str1.split(" ").map((str, index) => ({ value: str, index })),
    str2.split(" ").map((str, index) => ({ value: str, index })),
  ];

  for (let i = 0; i < s1.length; i++) {
    if (!isEqual(s1[i].value, s2[i].value)) {
      const whered = s2.where({ value: s1[i].value });
      if (whered) {
        const dObj = {
          type: CompareDifferenceTypes.NO_ORDER,
          correct: { word: s1[i].value, index: i },
          incorrect: { word: whered.value, index: whered.index },
        };

        differences.push(dObj);
      } else {
        const dObj = {
          correct: { word: s1[i].value, index: i },
          incorrect: {},
          type: CompareDifferenceTypes.NOT_EQUAL,
        };

        if (s2[i]) {
          dObj.incorrect = { word: s2[i].value, index: i };
        } else {
          dObj.type = CompareDifferenceTypes.MISSING;
          dObj.incorrect = { word: s1[i].value, index: i };
        }

        differences.push(dObj);
      }
    }
  }

  return {
    accuracy: (equality * 2) / (str1.length + str2.length - 2),
    differences,
  };
}