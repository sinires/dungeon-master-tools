# d-master-tools

Starter frontend project with:

- React + TypeScript
- Ant Design
- Zustand + Immer
- SCSS Modules

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
- JSON export/import without versioning

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
