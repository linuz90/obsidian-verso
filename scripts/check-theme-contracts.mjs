import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

const themeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readFile = (filePath) => fs.readFileSync(path.join(themeRoot, filePath), "utf8");
const readJson = (filePath) => JSON.parse(readFile(filePath));
const sourcePaths = [
  "src/foundation.css",
  "src/verso.css",
  "src/settings.css",
];
const sourceCss = sourcePaths
  .map(readFile)
  .join("\n");
const builtCss = readFile("theme.css");
const sourceRoot = postcss.parse(sourceCss);
const builtRoot = postcss.parse(builtCss);
const manifest = readJson("manifest.json");
const packageMetadata = readJson("package.json");
const versions = readJson("versions.json");
const readme = readFile("README.md");

const semanticVersionPattern = /^\d+\.\d+\.\d+$/;
if (
  manifest.name !== "Verso"
  || packageMetadata.name !== "obsidian-verso"
  || !semanticVersionPattern.test(manifest.version)
  || !semanticVersionPattern.test(manifest.minAppVersion)
) {
  throw new Error("Theme identity or manifest version metadata is invalid");
}

if (versions[manifest.version] !== manifest.minAppVersion) {
  throw new Error("versions.json does not map the current release to minAppVersion");
}

const legacyReleaseVersions = ["2.1.0", "2.1.1", "2.1.2"];
const retainedLegacyReleases = legacyReleaseVersions.filter((version) => version in versions);
if (retainedLegacyReleases.length) {
  throw new Error(
    `Verso still exposes MNML release fallbacks: ${retainedLegacyReleases.join(", ")}`,
  );
}

if (
  !readme.includes("# Verso")
  || !readme.includes("screenshots/verso.png")
  || !readme.includes("github.com/linuz90/obsidian-verso")
) {
  throw new Error("README identity, screenshot, or repository link is stale");
}

const storeScreenshot = fs.readFileSync(path.join(themeRoot, "screenshots/verso-store.png"));
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (
  !storeScreenshot.subarray(0, pngSignature.length).equals(pngSignature)
  || storeScreenshot.readUInt32BE(16) !== 512
  || storeScreenshot.readUInt32BE(20) !== 288
) {
  throw new Error("Store screenshot must be a 512x288 PNG");
}

const publicBrandPaths = [
  ...sourcePaths,
  "theme.css",
  "README.md",
  "CONTRIBUTING.md",
  "PUBLISHING.md",
  "AGENTS.md",
  "manifest.json",
  "package.json",
  "scripts/build-theme",
  "scripts/check-theme",
  "scripts/normalize-theme.mjs",
];
const staleBrandPaths = publicBrandPaths.filter((filePath) => /mnml/i.test(readFile(filePath)));
if (staleBrandPaths.length) {
  throw new Error(`Public files still contain the old theme name: ${staleBrandPaths.join(", ")}`);
}

const legacyClassContracts = [
  "borders-none",
  "cards",
  "chart-100",
  "chart-max",
  "chart-wide",
  "colorful-active",
  "colorful-frame",
  "colorful-headings",
  "full-file-names",
  "full-width-media",
  "iframe-100",
  "iframe-max",
  "iframe-wide",
  "img-grid-ratio",
  "img-grid",
  "img-100",
  "img-max",
  "img-wide",
  "labeled-nav",
  "links-ext-on",
  "links-int-on",
  "map-100",
  "map-max",
  "map-wide",
  "minimal-atom-dark",
  "minimal-atom-light",
  "minimal-ayu-dark",
  "minimal-ayu-light",
  "minimal-catppuccin-dark",
  "minimal-catppuccin-light",
  "minimal-dark-black",
  "minimal-dark-tonal",
  "minimal-default-dark",
  "minimal-default-light",
  "minimal-dracula-dark",
  "minimal-eink-dark",
  "minimal-eink-light",
  "minimal-everforest-dark",
  "minimal-everforest-light",
  "minimal-flexoki-dark",
  "minimal-flexoki-light",
  "minimal-focus-mode",
  "minimal-gruvbox-dark",
  "minimal-gruvbox-light",
  "minimal-light-contrast",
  "minimal-light-tonal",
  "minimal-light-white",
  "minimal-line-nums",
  "minimal-macos-dark",
  "minimal-macos-light",
  "minimal-nord-dark",
  "minimal-nord-light",
  "minimal-notion-dark",
  "minimal-notion-light",
  "minimal-rose-pine-dark",
  "minimal-rose-pine-light",
  "minimal-solarized-dark",
  "minimal-solarized-light",
  "minimal-status-off",
  "minimal-things-dark",
  "minimal-things-light",
  "max",
  "pdf-blend-light",
  "pdf-invert-dark",
  "sidebar-tabs-default",
  "table-100",
  "table-max",
  "table-wide",
  "trim-cols",
  "wide",
];

const selectorClasses = new Set();
sourceRoot.walkRules((rule) => {
  selectorParser((selectors) => {
    selectors.walkClasses((classNode) => selectorClasses.add(classNode.value));
  }).processSync(rule.selector);
});

const retainedLegacyClasses = legacyClassContracts.filter((className) =>
  selectorClasses.has(className)
);
if (retainedLegacyClasses.length) {
  throw new Error(
    `Standalone theme still contains legacy class contracts: ${retainedLegacyClasses.join(", ")}`,
  );
}

for (const copyrightNotice of [
  "Copyright (c) 2026 Fabrizio Rinaldi",
  "copyright (c) 2020-2026 Steph Ango (@kepano)",
]) {
  if (!builtCss.includes(copyrightNotice)) {
    throw new Error(`Generated CSS lost required notice: ${copyrightNotice}`);
  }
}

const legacyCustomProperties = new Set([
  "--ax1",
  "--ax2",
  "--ax3",
  "--bg1",
  "--bg2",
  "--bg3",
  "--hl1",
  "--hl2",
  "--line-height",
  "--line-width",
  "--max-width",
  "--sp1",
  "--tx1",
  "--tx2",
  "--tx3",
  "--tx4",
  "--ui1",
  "--ui2",
  "--ui3",
]);
sourceRoot.walkDecls((declaration) => {
  if (
    declaration.prop.startsWith("--minimal-")
    || legacyCustomProperties.has(declaration.prop)
  ) {
    throw new Error(`Standalone source still defines a Minimal variable: ${declaration.prop}`);
  }
});

const emptySelectors = [];
sourceRoot.walkRules((rule) => {
  if (!(rule.nodes ?? []).some((node) => node.type !== "comment")) {
    emptySelectors.push(rule.selector);
  }
});
if (emptySelectors.length) {
  throw new Error(`Standalone source contains empty rules: ${emptySelectors.join(", ")}`);
}

const versoDefinitions = new Set();
const versoReferences = new Set();
sourceRoot.walkDecls((declaration) => {
  if (declaration.prop.startsWith("--verso-")) versoDefinitions.add(declaration.prop);
  for (const match of declaration.value.matchAll(/var\((--verso-[\w-]+)/g)) {
    versoReferences.add(match[1]);
  }
});

const missingVersoDefinitions = [...versoReferences].filter(
  (property) => !versoDefinitions.has(property),
);
const unusedVersoDefinitions = [...versoDefinitions].filter(
  (property) => !versoReferences.has(property),
);
if (missingVersoDefinitions.length || unusedVersoDefinitions.length) {
  throw new Error(
    `Verso variables are inconsistent: missing=${missingVersoDefinitions.join(", ")} `
    + `unused=${unusedVersoDefinitions.join(", ")}`,
  );
}

const settingsComments = (root) => {
  const comments = [];
  root.walkComments((comment) => {
    if (comment.text.trimStart().startsWith("@settings")) {
      comments.push(comment.text.trim().replaceAll("\r\n", "\n"));
    }
  });
  return comments;
};

const sourceSettings = settingsComments(sourceRoot);
const builtSettings = settingsComments(builtRoot);
if (sourceSettings.length !== 1) {
  throw new Error(`Expected one Verso Style Settings block, found ${sourceSettings.length}`);
}
if (JSON.stringify(builtSettings) !== JSON.stringify(sourceSettings)) {
  throw new Error("Generated CSS no longer preserves Verso's Style Settings metadata");
}
if (!sourceSettings[0].includes("name: Verso") || !sourceSettings[0].includes("id: verso-style")) {
  throw new Error("Style Settings metadata no longer uses Verso's public identity");
}

const requiredPaletteProperties = [
  "--verso-accent",
  "--verso-accent-hover",
  "--verso-accent-strong",
  "--verso-bg-hover",
  "--verso-bg-primary",
  "--verso-bg-secondary",
  "--verso-border-muted",
  "--verso-border-strong",
  "--verso-border-subtle",
  "--verso-code-background",
  "--verso-highlight",
  "--verso-inline-code-background",
  "--verso-on-accent",
  "--verso-selection",
  "--verso-text-faint",
  "--verso-text-muted",
  "--verso-text-normal",
];

for (const selector of [".theme-light", ".theme-dark"]) {
  const properties = new Set();
  builtRoot.walkRules((rule) => {
    if (!rule.selectors.includes(selector)) return;
    rule.walkDecls((declaration) => properties.add(declaration.prop));
  });

  const missing = requiredPaletteProperties.filter((property) => !properties.has(property));
  if (missing.length) {
    throw new Error(`${selector} is missing palette properties: ${missing.join(", ")}`);
  }
}

for (const requiredToken of [
  ".verso-image-grid-off",
  ".verso-natural-media-width",
]) {
  if (!builtCss.includes(requiredToken)) {
    throw new Error(`Generated CSS lost standalone contract: ${requiredToken}`);
  }
}

let hasNativeReadableWidth = false;
let hasReadableWidthMargins = false;
let hasMobileReadableWidthMargins = false;
let hasCodeBackground = false;
builtRoot.walkDecls("--file-line-width", (declaration) => {
  hasNativeReadableWidth ||= declaration.value.includes("--verso-line-width")
    && declaration.value.includes("--verso-max-width");
});
builtRoot.walkRules((rule) => {
  if (!rule.selectors.includes(".is-readable-line-width")) return;
  rule.walkDecls("--file-margins", (declaration) => {
    hasReadableWidthMargins ||= declaration.value === "1rem 0 0";
  });
});
builtRoot.walkAtRules("media", (atRule) => {
  if (!atRule.params.includes("width <= 600px")) return;
  atRule.walkRules((rule) => {
    if (!rule.selectors.includes(".is-readable-line-width")) return;
    rule.walkDecls("--file-margins", (declaration) => {
      hasMobileReadableWidthMargins ||= declaration.value.includes("--file-margins-x");
    });
  });
});
builtRoot.walkDecls("--code-background", (declaration) => {
  hasCodeBackground ||= declaration.value === "var(--verso-code-background)";
});
if (!hasNativeReadableWidth) {
  throw new Error("Verso no longer delegates readable width to Obsidian's native variable");
}
if (!hasReadableWidthMargins) {
  throw new Error("Readable line width no longer measures the visible text area");
}
if (!hasMobileReadableWidthMargins) {
  throw new Error("Mobile readable line width lost its horizontal file margin");
}
if (!builtCss.includes('[class~="cm-contentContainer"]') || !hasCodeBackground) {
  throw new Error("Verso lost its visible text measure or code surface styling");
}
if (builtCss.includes("--table-drag-padding")) {
  throw new Error("Verso overrides Obsidian's editable table handle spacing");
}

const maxBuiltBytes = 64 * 1024;
const builtBytes = Buffer.byteLength(builtCss);
if (builtBytes > maxBuiltBytes) {
  throw new Error(
    `Standalone theme grew past ${maxBuiltBytes} bytes (${builtBytes}); review for inherited complexity`,
  );
}

console.log(
  `Standalone contracts passed: ${sourceSettings.length} Style Settings block, `
  + `${requiredPaletteProperties.length} palette tokens per mode, ${builtBytes} generated bytes.`,
);
