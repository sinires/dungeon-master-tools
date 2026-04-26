# dm-tools

## Commands

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Code quality:

```bash
npm run format
npm run format:check
npm run lint
npm run lint:fix
```

## Initiative Tracker

- Local state in browser (`localStorage`) via `zustand/persist`
- Initiative list with current turn tracking
- Player and monster templates for quick encounter setup
- Monster templates with walk, fly, and swim speed fields
- Multiple monster attacks with hit modifier, damage type, and damage dice
- Expanded monster rows with editable attacks, hit rolls, and damage rolls
- Multiline additional info display in expanded rows
- JSON export/import without versioning

## How to use

1. Fill templates in the Players and Monsters tabs.
2. For monster templates, set movement speed and add attacks with modifier, damage type, and damage dice formula.
3. In Initiative, choose type and select a template or type a new name, then click Add.
4. Expand a monster row to review and edit attacks. Use Roll hit for `1d20 + modifier`, and Roll damage for the damage dice formula.
5. Use Next Turn or Tab to move through turns, and Reset battle to restart round order.
6. Use Export/Import JSON to save or restore encounters locally.

## FSD structure

`src/` is decomposed by layers:

- `app` - application entry and root composition
- `pages` - route-level screens
- `features` - user actions (`add-combatant`, `turn-controls`, `snapshot-transfer`)
- `entities` - domain model and UI (`tracker`)
- `shared` - reusable libs/utilities

## GitHub scripts and workflows

Local scripts:

```bash
npm run start
npm run ci
npm run build:pages
```

GitHub Actions:

- `.github/workflows/ci.yml` runs `lint + build` on every push and PR.
- `.github/workflows/pages.yml` builds and deploys `dist/` to GitHub Pages from `main`.

To enable Pages deploy:

1. Open `Settings -> Pages` in your GitHub repository.
2. Set `Source` to `GitHub Actions`.
3. Push to `main` or run `Deploy GitHub Pages` manually from Actions tab.
