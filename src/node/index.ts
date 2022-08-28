import { toInteger } from "../misc";

interface Memory {
  gigabytes: number;
  megabytes: number;
  kilobytes: number;
  bytes: number;
}

export interface MemoryUsed {
  rss: Memory;
  external: Memory;
  heapUsed: Memory;
  heapTotal: Memory;
  arrayBuffers: Memory;
  total: Memory;
}

const oldMemoryUsage = process.memoryUsage;

export function ramUsed(): MemoryUsed {
  const ramUsed = {} as MemoryUsed;

  for (const key of Object.keys(oldMemoryUsage())) {
    const mem = toInteger(oldMemoryUsage()[key]);

    ramUsed[key] = {
      gigabytes: mem / (1024 * 1024 * 1024),
      megabytes: mem / (1024 * 1024),
      kilobytes: mem / 1024,
      bytes: mem,
    };
  }

  const totalMem =
    ramUsed.heapTotal.bytes |
    ramUsed.external.bytes |
    ramUsed.heapUsed.bytes |
    ramUsed.arrayBuffers.bytes |
    ramUsed.rss.bytes;

  ramUsed.total = {
    gigabytes: totalMem / (1024 * 1024 * 1024),
    megabytes: totalMem / (1024 * 1024),
    kilobytes: totalMem / 1024,
    bytes: totalMem,
  };

  return ramUsed;
}
