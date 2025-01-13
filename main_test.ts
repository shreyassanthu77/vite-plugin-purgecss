import { build } from "vite";
import { purgecss } from "./main.ts";

await build({
  root: "./test",
  plugins: [purgecss({})],
});
