# Verso — Agent Guide

## What this is

A standalone Obsidian theme with a small, credited foundation adapted from Minimal. Source of truth lives in this repo (`~/Code/obsidian-verso/`).

## Docs

Official theme development guide: https://docs.obsidian.md/themes/app-themes/build-theme

Key rules:
- `src/foundation.css` contains the small standalone compatibility and layout foundation
- Verso changes go in `src/verso.css`
- Style Settings metadata lives in `src/settings.css`
- Run `pnpm install` once, then `pnpm build` after CSS changes; `theme.css` is generated and standards-normalized
- Run `pnpm check` before committing; it verifies generated-file drift and checks both source and output with the official Obsidian Stylelint config
- Keep Minimal Theme Settings contracts out of the standalone source
- Preserve Verso's own Style Settings block and the default appearance without plugins
- `manifest.json` defines the theme name, version, and author
- The folder name inside `.obsidian/themes/` must exactly match the `name` field in `manifest.json`

## File structure

```
manifest.json          — Theme metadata (name must be "Verso")
versions.json          — Published theme version to minimum Obsidian mapping
theme.css              — Generated theme loaded by Obsidian
src/foundation.css     — Standalone current-Obsidian foundation
src/verso.css          — Verso's design layer
src/settings.css       — Focused Style Settings metadata
scripts/build-theme    — Rebuilds theme.css
scripts/check-theme    — Verifies theme.css matches its sources
scripts/check-theme-contracts.mjs — Guards standalone size, palette, and settings contracts
scripts/normalize-theme.mjs — Produces scanner-compliant CSS
LICENSE-Minimal        — Upstream MIT license
README.md              — Project description
CONTRIBUTING.md        — Local setup and development workflow
PUBLISHING.md          — Release and Community Directory checklist
screenshots/           — Public preview assets
```

## Development workflow

Use a real theme directory containing file symlinks so Obsidian discovers it as a normal theme folder:

```
{Vault}/.obsidian/themes/Verso/manifest.json -> ~/Code/obsidian-verso/manifest.json
{Vault}/.obsidian/themes/Verso/theme.css -> ~/Code/obsidian-verso/theme.css
```

Run `pnpm build`, then reload Obsidian with Cmd+R. Changes to `manifest.json` require a full restart.

When publishing an update, bump `manifest.json` deliberately and add its compatibility mapping to `versions.json`.

To use in a new vault, symlink the repo:

```bash
mkdir -p "/path/to/vault/.obsidian/themes/Verso"
ln -s ~/Code/obsidian-verso/manifest.json "/path/to/vault/.obsidian/themes/Verso/manifest.json"
ln -s ~/Code/obsidian-verso/theme.css "/path/to/vault/.obsidian/themes/Verso/theme.css"
```

## Design principles

- Build on current Obsidian variables and behavior instead of carrying historical theme compatibility
- Keep the standalone foundation small; the contract check caps generated CSS at 64 KB
- Vercel/gists.sh inspired: quiet, neutral, focused
- Native system typography
- Comfortable line-height, restrained headings, subdued file titles
- Reuse Verso and Obsidian variables instead of hardcoded component colors
- Credit retained Minimal-derived ideas and preserve `LICENSE-Minimal`
- Keep distributable CSS private and offline: Community Directory themes may not load runtime assets from the network
