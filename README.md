# Verso

**Verso** is the reverse side of a leaf in a book—the left-hand page when opened.

A quiet, native-feeling standalone Obsidian theme by [Fabrizio Rinaldi](https://x.com/linuz90), inspired by the [Codex app](https://openai.com/codex/) and the clarity of [Minimal](https://github.com/kepano/obsidian-minimal) by Steph Ango (`@kepano`).

![Verso in light mode](./screenshots/verso.png)

Verso refines the app as a whole with **a cleaner palette, subtler iconography, quieter details, and a more native macOS feel.** It uses a small standalone foundation built for current Obsidian releases instead of embedding a complete copy of another theme.

This is a third-party community theme and is not affiliated with Obsidian or OpenAI.

## Install

### From the Obsidian theme directory

Once Verso is listed, open **Settings → Appearance → Themes → Manage**, search for **Verso**, and select **Install and use**.

### Manually from a GitHub release

1. Download `manifest.json` and `theme.css` from the [latest GitHub release](https://github.com/linuz90/obsidian-verso/releases/latest).
2. Create `<your-vault>/.obsidian/themes/Verso/`.
3. Put both files inside that folder.
4. Restart Obsidian, then select **Verso** in **Settings → Appearance → Themes**.

The folder name must exactly match the `name` in `manifest.json`.

Verso requires Obsidian 1.13.7 or newer. On desktop, use installer version 1.2.7 or newer because the theme uses `color-mix()`.

For the closest match to the screenshots on macOS, enable **Translucent window** under **Settings → Appearance → Advanced**. Verso works normally without translucency.

### Development install

Clone the repository and link the two files Obsidian loads:

```bash
git clone https://github.com/linuz90/obsidian-verso.git ~/Code/obsidian-verso
mkdir -p "/path/to/vault/.obsidian/themes/Verso"
ln -s ~/Code/obsidian-verso/manifest.json "/path/to/vault/.obsidian/themes/Verso/manifest.json"
ln -s ~/Code/obsidian-verso/theme.css "/path/to/vault/.obsidian/themes/Verso/theme.css"
```

Run `pnpm install` once, then `pnpm build` and reload Obsidian with `Cmd+R`. Changes to `manifest.json` require a full restart.

## Optional sidebar icons

The folder icons shown in the screenshot come from the optional [Iconize](https://github.com/FlorianWoelki/obsidian-iconize) community plugin. Verso does not require or bundle Iconize; it simply gives monochrome sidebar icons spacing and contrast that fit the theme.

After installing Iconize, right-click any file or folder and select **Change icon**. The built-in Lucide pack is enough to create a restrained, consistent sidebar without downloading extra assets.

### Let an agent assign the icons

Iconize stores its configuration in `<your-vault>/.obsidian/plugins/obsidian-icon-folder/`, with path-to-icon mappings in `data.json`. You can point a coding agent at that folder and ask it to choose the icons for you.

A safe prompt:

> Inspect `<your-vault>/.obsidian/plugins/obsidian-icon-folder/`, especially `manifest.json` and `data.json`. Back up `data.json`, preserve its `settings` and all existing mappings, then add restrained Lucide icons for folders that do not have one. Use vault-relative path keys and the plugin's existing `Li...` icon identifiers. Do not edit the plugin code. Show me the proposed mapping before writing, and tell me when to reload Obsidian.

Close Obsidian before a direct `data.json` edit, or reload it immediately afterward, so the running plugin does not overwrite the agent's changes. Iconize is optional and its upstream project currently describes itself as end-of-maintenance; Verso remains fully usable without it.

## Typography

Verso uses Obsidian's native system font stacks for interface, text, editor, and monospace typography. The theme never downloads fonts or other assets at runtime.

## Customization

Verso supports the generic [Style Settings](https://github.com/community-archive/obsidian-style-settings) plugin with a small theme-specific panel. It exposes line height, readable line width, maximum pane width, natural media sizing, and image-grid behavior while keeping the core palette intentional. Primary navigation stays on Obsidian's standard compact layout.

[Minimal Theme Settings](https://github.com/kepano/obsidian-minimal-settings) is designed specifically for Minimal and is not required or supported by Verso. Disable it while using Verso; equivalent settings that fit this theme live in Style Settings or Obsidian's native Appearance settings.

## Development

The distributable `theme.css` is generated from Verso's standalone foundation, visual layer, and Style Settings metadata, then normalized for Obsidian's official CSS scanner:

```text
src/foundation.css + src/verso.css + src/settings.css → theme.css
```

- Edit the source files in `src/`, never generated `theme.css` directly.
- Run `pnpm build` after CSS changes and `pnpm check` before committing.
- Publishing an update requires an intentional `manifest.json` version bump.

See [PUBLISHING.md](./PUBLISHING.md) for the release and Community Directory checklist.

## License and attribution

Verso is released under the [MIT License](./LICENSE).

Verso began as a visual fork of [Minimal](https://github.com/kepano/obsidian-minimal). Its independent codebase retains small MIT-licensed portions of Minimal's semantic color mapping and image-grid behavior; Steph Ango retains copyright in that work, and Minimal's license is preserved in [LICENSE-Minimal](./LICENSE-Minimal).

If you enjoy the foundation Verso builds on, consider [supporting Steph's work](https://www.buymeacoffee.com/kepano).
