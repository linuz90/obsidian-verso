import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import stylelint from "stylelint";
import obsidianConfig from "stylelint-config-obsidianmd";

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error("Usage: normalize-theme.mjs <input.css> <output.css>");
  process.exit(1);
}

const themeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceCss = fs.readFileSync(inputPath, "utf8").replaceAll("\r\n", "\n");
const fixed = await stylelint.lint({
  code: sourceCss,
  config: obsidianConfig,
  configBasedir: themeRoot,
  fix: true,
});
const normalizedCss = `${fixed.code.trimEnd()}\n`;
const checked = await stylelint.lint({
  code: normalizedCss,
  config: obsidianConfig,
  configBasedir: themeRoot,
});
const warnings = checked.results.flatMap((result) => result.warnings);
const errors = warnings.filter((warning) => warning.severity === "error");

if (errors.length) {
  const counts = errors.reduce((result, warning) => {
    result[warning.rule] = (result[warning.rule] ?? 0) + 1;
    return result;
  }, {});
  throw new Error(`Generated CSS failed Obsidian Stylelint: ${JSON.stringify(counts)}`);
}

fs.writeFileSync(outputPath, normalizedCss);
console.log(`Normalized theme.css: 0 errors, ${warnings.length} warnings`);
