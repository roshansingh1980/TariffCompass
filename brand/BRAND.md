# TariffCompass — brand

## The mark

A compass rose whose heading needle doubles as the trade route: a trail of dots
marks where the shipment sits today, the red heading needle breaks the bezel
toward where it should go.

Two builds:

| Build | Use at | Bezel stroke | Needle base | Trail |
|---|---|---|---|---|
| `full` | 48 px and above | 2 units | 11 units | 3 dots |
| `icon` | below 48 px | 4 units | 14 units | none |

Below 24 px the east–west needle drops and the bezel goes solid ink — at that
size only two shapes still read. That is `favicon.svg`.

## Type

- **Wordmark:** Playfair Display Medium (500), tracking 0. Logotype only.
- **Descriptor:** Geist Medium, 0.3em tracking, uppercase.
- **All UI:** Geist. The serif never appears in interface text.

The descriptor sits between two hairline rules that run the full width of the
wordmark, with `TRADE INTELLIGENCE` centred between them. This is the standard
treatment for every lockup that carries a descriptor. Below the hero — header,
favicon, avatars — the descriptor is dropped entirely.

## Colour

| Token | Hex | Use |
|---|---|---|
| Ink | `#0A0A0A` | Wordmark, page foreground |
| Graphite | `#171717` | East needle (light) |
| Slate | `#737373` | Descriptor |
| Mist | `#A3A3A3` | West needle, trail dots (light) |
| Line | `#D4D4D4` | Bezel (light) |
| **Signal red** | **`#C8102E`** | Heading needle — the only accent |
| Signal red, dark | `#E11D2E` | Heading needle on dark grounds |

Dark grounds swap to `#404040` bezel, `#525252` west needle and trail,
`#FAFAFA` east needle.

Every neutral is the app's own Tailwind neutral token — the logo and the
interface are one system, not two.

## Files

| Path | What |
|---|---|
| `components/brand/tc-mark.tsx` | The mark as a React component. `variant="full"` above 48 px. |
| `public/mark.svg` | Full mark, light ground |
| `public/mark-dark.svg` | Full mark, dark ground |
| `public/mark-mono.svg` | One colour, uses `currentColor` — etch, fax, embroidery |
| `public/icon.svg` | Icon build, 32 px and up |
| `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` | Picked up automatically by Next.js |

There is deliberately **no `logo.svg` with the wordmark baked in.** The app loads
Playfair through `next/font`, so the header renders the mark as SVG and the
wordmark as live text — sharp at any zoom, selectable, readable to screen
readers, and it can never drift from the site's type. For decks and PDFs,
export a PNG from the design canvas instead.

## Canvas

https://claude.ai/code/artifact/cd7449a6-a706-467e-a6f8-3def07402285
