# Contributing to Verso

## Local setup

```bash
git clone https://github.com/linuz90/obsidian-verso.git ~/Code/obsidian-verso
cd ~/Code/obsidian-verso
pnpm install
mkdir -p "/path/to/vault/.obsidian/themes/Verso"
ln -s ~/Code/obsidian-verso/manifest.json "/path/to/vault/.obsidian/themes/Verso/manifest.json"
ln -s ~/Code/obsidian-verso/theme.css "/path/to/vault/.obsidian/themes/Verso/theme.css"
```

Run `pnpm build`, then reload Obsidian with `Cmd+R`. Changes to `manifest.json` require a full restart.

## Development workflow

The distributable theme is generated from three source files:

```text
src/foundation.css + src/verso.css + src/settings.css → theme.css
```

- Edit files in `src/`, never generated `theme.css` directly.
- Run `pnpm build` after CSS changes.
- Run `pnpm check` before committing.
- Bump `manifest.json` deliberately when publishing an update.

See [PUBLISHING.md](./PUBLISHING.md) for the release and Community Directory checklist.
