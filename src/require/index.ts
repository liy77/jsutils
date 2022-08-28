import { Dirent, readdirSync } from "node:fs";
import path from "node:path";

const Module: typeof import("node:module") & {
  _extensions: NodeRequire["extensions"];
} = module.constructor.length > 1 ? module.constructor : require("node:module");

/**
 * Only for CommonJS modules
 */
export function overrideCommonJSModule <M = any, R extends M = M> (module: string, filepath: string, modify: (module: M) => R): R {
    const req = Module.createRequire(process.cwd());
    const modulePath = req.resolve(module);
    const moduleSplit = modulePath.split("\\");
    const fullPath = path.join(modulePath.replace(moduleSplit.at(-1), ""), filepath);

    const original = require(fullPath);
    const modified = modify(original);

    return require.cache[fullPath].exports = modified;
}

export function loadCommonJSModule (id: string): any {
    let mod: string;

    id = id.replaceAll("/", "\\");
    try {
        require(id);
        mod = id;
    }
    catch {
        const arr = readdirSync(process.cwd(), {
            withFileTypes: true,
            encoding: "utf8"
        });

        const newArr = [];
        for (const d of arr) {
            if (d.name.startsWith(".") || d.name === "node_modules") {
                continue;
            }

            if (d.isDirectory()) {
                const resolve = (main: string, data: Dirent) => {
                    try {
                        for (const d2 of readdirSync(path.join(main, data.name), {
                            withFileTypes: true,
                            encoding: "utf8"
                        })) {
                            if (d2.isDirectory()) {
                                resolve(path.join(main, data.name), d2);
                            }
                            else if (d2.isFile()) {
                                newArr.push(path.join(main, data.name, d2.name));
                            }
                        }
                    } catch {}
                }

                resolve(process.cwd(), d);
            }
            else {
                newArr.push(path.join(process.cwd(), d.name));
            }
        }

        mod = newArr.find((dir) => {
            return dir.includes(id)
        });
    }

    return require(mod);
}

try {
    require("typescript")
    require("pirates")

    module.exports.importUtil = require("./TSsupport")
} catch {
    module.exports.importUtil = {}
}

/**
 * Only returns if dependencies `typescript` and `pirates` was installed
 */
export let importUtil: typeof import("./TSsupport") =
  {} as typeof import("./TSsupport"); 