# Vite Plugin PurgeCSS
Vite plugin for [PurgeCss](https://github.com/FullHuman/purgecss)

## Installation

```bash
npx jsr add @shreyas/vite-plugin-purgecss
```

## Usage

```ts
import { defineConfig } from "vite";
import purgecss from "@shreyas/vite-plugin-purgecss"; // import this plugin

export default defineConfig({
  plugins: [
    purgecss({}), // add this plugin
  ],
});
```

## if you are using svelte

```ts
import { defineConfig } from "vite";
import { purgecss, safeLists } from "@shreyas/vite-plugin-purgecss"; // import this plugin

export default defineConfig({
  plugins: [
    purgecss({
      safelist: safeLists.svelte,  // include svelte safelist to not purge svelte classes
    }),// add this plugin
  ],
});
```


## Options
Checkout [PurgeCSS Options](https://purgecss.com/configuration.html)

## License
MIT

