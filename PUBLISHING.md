# Publishing Verso

Verso is a standalone theme for current Obsidian releases. It does not vendor or update from Minimal, but its independent codebase retains small, clearly credited, MIT-licensed portions adapted from Minimal.

## Community Directory positioning

Describe Verso as a standalone theme that began as a visual fork of Minimal and now has its own independent codebase, not as a compatible replacement. The generated theme owns its palette and focused component styling, has one small Style Settings panel, keeps Obsidian's standard primary navigation, and excludes Minimal's color schemes, helper classes, block widths, cards, legacy compatibility, and community-plugin styling.

Keep Steph Ango's credit and `LICENSE-Minimal` in the repository. Before submission, ask Kepano to confirm his approval in a public GitHub issue or comment and list him as a Community Directory contributor.

## Official CSS scanner

Obsidian's official [`stylelint-config-obsidianmd`](https://github.com/obsidianmd/stylelint-config) uses the same blocking rules as the Community Directory scanner. Run `pnpm check` against the final distributable before creating a release; warning-severity findings are advisory, but error-severity findings block submission.

The build combines the three files in `src/`, applies the official Stylelint fixes, and emits `theme.css`. CI checks both the handwritten source and generated asset on every push and pull request.

## Name

The directory-facing name is **Verso**. Obsidian's [manifest rules](https://docs.obsidian.md/Reference/Manifest#name) prohibit “Obsidian”, “Theme”, and related variants in theme names, and a theme name cannot change after submission. Recheck the active theme registry before submitting.

## Initial submission checklist

1. Publish the fresh repository history as `linuz90/obsidian-verso` and confirm the theme name.
2. Link Kepano's public approval and add him as a Community Directory contributor.
3. Run a directory preview scan to confirm the Verso name is accepted despite the unrelated plugin with the same name.
4. Run `pnpm check` and confirm zero error-severity findings from the official CSS scanner.
5. Confirm the default branch contains `README.md`, `LICENSE`, `LICENSE-Minimal`, `manifest.json`, `theme.css`, `versions.json`, and both screenshots.
6. Check that `manifest.json` has the final name, semantic version, minimum Obsidian version, and author details.
7. Test light and dark modes on the minimum supported desktop version and the current mobile version.
8. Test the default theme with community plugins disabled, then confirm Style Settings discovers the Verso panel and its representative controls work.
9. Create a GitHub release whose tag exactly matches the `version` in `manifest.json` without a `v` prefix.
10. Attach `manifest.json` and `theme.css` to that release as binary release assets.
11. Sign in at [community.obsidian.md](https://community.obsidian.md), connect the GitHub account, open **Themes**, and select **New theme**.
12. Submit the repository URL, use `screenshots/verso-store.png` as the screenshot path, and select both Light and Dark as supported modes.
13. Accept the developer policies and address any automated review feedback. If a fix changes the release, bump the manifest version and publish a matching new release.

The official process is documented in [Submit your theme](https://docs.obsidian.md/themes/app-themes/submit-theme). The directory reads `manifest.json` from the default branch, but installs `manifest.json` and `theme.css` from the matching GitHub release.

## Updates after acceptance

For later updates, bump `manifest.json`, rebuild `theme.css`, create a matching GitHub release, and attach both distributable files. Obsidian will offer the update automatically.
