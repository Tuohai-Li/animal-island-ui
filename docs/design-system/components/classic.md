# Classic components

These components restore historical presentation on top of v2.3.0. Provenance and
asset rights are documented in [CLASSIC-NOTICE.md](../../../CLASSIC-NOTICE.md).
The existing Time and Loading implementations remain current.

## Phone

A cream phone screen with a 3-by-3 grid of historical application icons. The original
527 × 788 proportions scale to the available width, capped at 380px. Container units
scale the 136px original corner radius, 123px icon tiles and 32px gaps together.
The welcome line and live 12-hour clock sit above the grid; dots sit below it.

Applications are native buttons with Chinese accessible names, yellow focus outlines
and an `onAppClick(appId)` callback. A one-second timer is cleared on unmount.
`greeting` defaults to `Welcome!`; native div attributes are forwarded.
Reduced-motion preferences disable icon and screen animations.

## Wallet

An overlapping bell pouch and olive capsule use three sizes: small (96 × 32px),
medium (132 × 42px), large (176 × 54px). Pouch diameters are 38 / 50 / 66px.
White tabular digits use a warm brown shadow. Hover bounces the pouch unless reduced
motion is requested. Native div attributes pass through to the root.

Numeric values receive configurable thousands separators while preserving their sign
and fractional part. String values are unchanged. `icon` replaces the pouch artwork.

## WeddingInvitation

A responsive invitation, max-width 420px, with cream paper, pastel floral decoration,
16px corners, historical title/couple artwork and two warm inset border details.
Content order: title, illustration, couple names, date, venue, message and optional
160px tear-off lottery stub. Hiding the stub also removes its notches and reserved space.

Props customize text, ReactNode headings/message, date/time, venue and lottery number.
The ref exposes `getElement()` and async `exportAsImage(filename?)`. The export button
is disabled while working, downloads a 2× PNG, and exposes a retryable alert on failure.
The PNG renderer is lazy-loaded; existing bundled fonts are embedded in the snapshot.
Reduced-motion preferences stop floating flowers and the heart animation.
