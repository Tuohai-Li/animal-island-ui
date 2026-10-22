# Classic component restoration

This fork is based on upstream `guokaigdg/animal-island-ui` v2.3.0,
commit `2d855fc6c1cb56cc4152290f50c43439d4a4920f`.

Restored sources:

- **Phone** and its referenced historical icons: `rokieon/animal-island-ui`,
  commit `0cb5126be35c02e640e93e4efd20772ad2f539c0` (package version 0.8.0).
- **Wallet** and **WeddingInvitation**, including their artwork and style rules:
  `lifeodyssey/animal-island-ui-tailwind`, commit
  `2abb93f685cf0915a15537be5d3a2c9ccb8bdf57` (its independent v1.7.0).
  These two components are adaptations of that port, not recovered original
  upstream v1.7.0 source.
- **Time** restores the horizontal historical presentation while retaining locale/date formatting.
- **Loading** restores the original island SVG and bundled GSAP/MotionPath animation
  from the 0.8.0 source. Animation globals are isolated in one sandboxed frame per instance.
- **Icon** restores the independent port catalogue: ten named application images and
  488 item PNGs, with their actual (non-contiguous) IDs.
- **BackTop** restores the historical embedded PNG; **Divider** restores recovered
  local line assets and the zigzag bitmap. **Footer** restores tree/sea artwork and
  **Cursor** restores the original cursor PNG, and **Select** restores the historical hover-hand SVG.
- The 511-file historical `src/assets/img/` directory was recovered from the
  independent port archive, with five divider assets and `divider_line.png` from
  the 0.8.0 snapshot. Existing modern assets are retained.

Adaptations use the current Less Modules build, existing naive-icons decorations,
keyboard-accessible phone buttons, responsive sizing and a lazy PNG exporter.
Original authors retain attribution in their Git history and source repositories.

The historical artwork includes third-party game imagery. Its restoration does
not grant additional rights or relicense that artwork under the upstream code's
MIT license. The upstream statements that all artwork is original do not apply
to these restored historical assets. Upstream removed historical assets in its
[v1.9.0 remediation](https://github.com/guokaigdg/animal-island-ui/releases/tag/v1.9.0);
see the [GitHub notice](https://github.com/github/dmca/blob/master/2026/09/2026-09-03-nintendo.md)
for context.

## Preview

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/#/classic`. Individual demos are at `#/phone`,
`#/wallet` and `#/wedding`. No changes have been published to npm.

## Completeness

The available source snapshots are original 0.8.0 plus the independent Tailwind
port v1.7.0, not a recovered complete upstream v1.8.0 checkout. This restoration
covers the supplied removal list using those sources. No external image URLs were
found in the recovered port's `src/` files; its artwork is bundled locally or as
historical embedded data. There is no invented remote-image dependency.

Additional previews: `#/materials` for the historic decoration/BackTop examples,
and `#/icon` for the full searchable catalogue. Loading defaults to `island`;
`variant="snow"` retains the later snow screen. Footer defaults to `tree`, with
`sea` and `copyright` modes. Current date formatting, keyboard and scroll APIs
remain supported.
