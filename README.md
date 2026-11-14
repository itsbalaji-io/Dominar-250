# Bajaj Dominar 250 — 3D assembly workshop

Browser workshop for a schematic Dominar 250. Orbit, explode, pick parts, enforce install order, run a 50-step teardown / rebuild, and browse the public Moonlight parts fiche.

This is **not** factory CAD. Meshes are primitives scaled to published specs (1453 mm wheelbase, 100/80-17 and 130/70-17, 300/230 mm discs, 13 L tank, USD forks, 248.77 cc SOHC 4-valve).

## Honest inventory

| Layer | Count | What it is |
| --- | --- | --- |
| 3D workshop meshes | 171 | Selectable schematic parts in the scene |
| Moonlight fiche plates | 59 | Exploded 2D diagrams, ColorDoc 71120159 Rev. 10 (2025-01-01) |
| Fiche line items | 1,238 | Published OEM rows (site banner says 1,239) |
| Published kits | 17 | Copied from the same fiche |
| Training | 50 + 50 | Teardown and rebuild steps |

OEM numbers in the right-hand **Moonlight fiche** panel are copied from [Moonlight Bajaj Dominar 250 BS VI Rev. 10](https://moonlightbajaj.com/en/catalogue/bajaj/dominar-250-bs-vi-rev-10). They are not invented. The 3D inventory is still 171 meshes: bolts, washers, colourways, and consumables are not separately meshed.

## Stack

React 18, TypeScript, Three.js, React Three Fiber, Vite, Zustand.

## Run

```bash
# Install dependencies
npm install

# Dev server (0.0.0.0:5173)
npm run dev

# Typecheck and production build
npm run build
```

## Controls

- Drag: orbit
- Scroll: zoom
- Right-drag: pan
- Click: select
- Double-click: remove / fit
- Ctrl+Z / Ctrl+Shift+Z: undo / redo
- Keys 1–6: camera views
- E: explode
- B: empty bay
- Delete / Backspace: toggle selected part

## Workshop modes

- **Inspect** — pick parts, read source / confidence
- **Exploded** — slide explode
- **Training** — 50-step teardown or rebuild
- **Empty bay** — start from a stripped bike and rebuild

Dependency lock is on by default (`Deps ON`). Switch to **Free fit** to ignore install order.

## Fiche browser

Right panel lists all 59 plates and 17 published kits. Search by part number or name. Selecting a 3D mesh jumps to the mapped plate (for example USD forks → plate 43).

Local plate PNGs used for silhouette work live under `research/refs/`. Source notes: `research/SOURCES.md`.

## Limits

- Geometry is schematic, not photogrammetry or OEM CAD.
- Engine internals (cams, piston, gearbox) are educational cutaways.
- Training torque figures are workshop-typical, not copied from a service-manual page.
- Paint is Canyon Red with charcoal accents, matching public product photography — not every factory colourway.

## Repo

Feature work landed on `261110-feat-dominar-250-simulator`.
