import { PurgeCSS, type Options, defaultOptions } from "purgecss";
import type { Plugin } from "vite";
import { defu } from "defu";

/**
 * A vite plugin for purgecss
 * @param options - Options for purgecss
 *
 * @example
 * ```ts
 * import { defineConfig } from "vite";
 * import purgecss from "@shreyas/vite-plugin-purgecss";
 *
 * export default defineConfig({
 *   plugins: [
 *     purgecss({
 *	     	// ... options
 *     }),
 *   ],
 * });
 * ```
 */
export function purgecss(options: Partial<Options>): Plugin {
  const _options = defu(options, defaultOptions) as Options;
  return {
    name: "@shreyas/vite-plugin-purgecss",
    enforce: "post",
    async generateBundle(_, bundle) {
      const cssFiles: string[] = Object.keys(bundle).filter((file) =>
        file.endsWith(".css"),
      );
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

const SVELTE_SAFELIST = /svelte-[a-zA-Z0-9]{6,8}/;
/**
 * A set of safelists provided for some popular frameworks
 * only svelte is available for now
 *
 * These safelists help purgecss know which classes to keep in the final css
 *
 *
 * @example
 * ```ts
 * import { defineConfig } from "vite";
 * import { purgecss, safeLists } from "@shreyas/vite-plugin-purgecss";
 *
 * export default defineConfig({
 *   plugins: [
 *     purgecss({
 *			 // include svelte safelist to not purge svelte classes
 *       safelist: safeLists.svelte,
 *     }),
 *   ],
 * });
 * ```
 */
export const safeLists: Record<string, Options["safelist"]> = {
  svelte: {
    greedy: [SVELTE_SAFELIST],
    deep: [],
    standard: [],
    keyframes: [],
    variables: [],
  },
};

export default purgecss;
