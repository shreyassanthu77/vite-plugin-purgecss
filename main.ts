import { PurgeCSS, type Options, defaultOptions } from "purgecss";
import type { Plugin } from "vite";
import { defu } from "defu";

const CSS_REGEX = /\.css$/;

export function purgecss(options: Partial<Options>): Plugin {
  const _options = defu(options, defaultOptions) as Options;
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
      const content = [
        ...(_options.content ?? []),
        "**/*.{html,js,jsx,ts,tsx,vue,svelte}",
      ];
      for (const cssFile of cssFiles) {
        if ("source" in bundle[cssFile]) {
          const input = bundle[cssFile].source;
          if (typeof input !== "string") continue;
          const purged = await purgecss.purge({
            ..._options,
            content,
            css: [..._options.css, { raw: input }],
          });
          if (purged.length === 0) continue;
          bundle[cssFile].source = purged[0].css;
        }
      }
    },
  };
}

purgecss({});

export default purgecss;
