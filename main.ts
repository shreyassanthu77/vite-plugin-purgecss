import { PurgeCSS, type Options } from "purgecss";
import type { Plugin } from "vite";

const CSS_REGEX = /\.css$/;

export function purgecss(options: Options): Plugin {
  return {
    name: "@shreyas/vite-plugin-purgecss",
    enforce: "post",
    async generateBundle(_, bundle) {
      const cssFiles: string[] = [];
      for (const file of Object.keys(bundle)) {
        if (file.match(CSS_REGEX)) {
          cssFiles.push(file);
        }
      }
      if (cssFiles.length === 0) return;

      const purgecss = new PurgeCSS();
      for (const cssFile of cssFiles) {
        if ("source" in bundle[cssFile]) {
          const input = bundle[cssFile].source;
          if (typeof input !== "string") continue;
          const purged = await purgecss.purge({
            ...options,
            content: [{ raw: input, extension: "css" }],
          });
          bundle[cssFile].source = purged[0].css;
        }
      }
    },
  };
}

export default purgecss;
