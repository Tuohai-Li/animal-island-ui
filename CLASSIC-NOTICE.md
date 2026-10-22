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
- **Time** and **Loading** retain the current upstream implementation.

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
