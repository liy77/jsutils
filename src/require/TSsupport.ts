import type { CompilerOptions } from "typescript"
import type Typescript from "typescript"
import type Pirates from "pirates"

let ts: typeof Typescript,
    addHook: typeof Pirates["addHook"]

try {
    ts = require("typescript")
    addHook = require("pirates").addHook
} catch {
    // No typescript or pirates found
}

export let tsImport: () => void;

export function allowTSImport(options: CompilerOptions): () => void {
  return addHook((code, filename) => ts.transpile(code, options, filename), {
    extensions: [".ts"],
  });
}

export function setTSImport(): void {
  if (tsImport) {
    tsImport();
  } else {
    allowTSImport({});
  }
}

export function importTSModule(
  id: string,
  tsOptions: CompilerOptions = {},
  req = require
) {
  const options = Object.assign(
    {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ESNext,
      esModuleInterop: true,
      strict: true,
    } as CompilerOptions,
    tsOptions
  );

  tsImport = allowTSImport(options);
  return req(id);
}

export let esmImport: () => void;

export function allowESMImport() {
  return addHook(
    (code) =>
      ts.transpile(code, {
        allowJs: true,
        strict: true,
        module: ts.ModuleKind.CommonJS,
      }),
    {
      extensions: [".js"],
    }
  );
}

export function setESMImport() {
  if (esmImport) {
    esmImport();
  } else {
    allowESMImport();
  }
}

export function importESMModule(id: string, req = require) {
  allowESMImport();
  return req(id);
}