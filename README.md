# Embed a portal (3D web component + Vite)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikehenken/embedaportal)

React Three Fiber “portal” frames shipped as a **`<portal-widget>`** custom element. **Vite** builds the app into `dist/`; **Cloudflare Workers** static assets serve `dist/`.

**Requirements:** GitHub repo must stay **public** for the Deploy to Cloudflare button.

**Deploy to Cloudflare (GitHub button):** [Workers Builds auto-detects](https://developers.cloudflare.com/workers/platform/deploy-buttons/#best-practices) **`scripts.build`** and **`scripts.deploy`** in `package.json` and pre-fills the wizard. This repo sets **`build`** → `vite build` and **`deploy`** → `wrangler deploy` (build + deploy are separate steps on Cloudflare, so `deploy` must not bundle `npm run build` or you’d run Vite twice). If the UI is still blank, enter **Build:** `npm run build` and **Deploy:** `npx wrangler deploy` manually. **`[assets] directory = "./dist"`** is only in `wrangler.toml`; the form does not set it—`npm run build` must run first so `dist/` exists.

## Develop

```bash
npm install
npm run dev
```

## Production build + deploy (CLI)

```bash
npm install
npm run ship
```

(`ship` runs `vite build` then `wrangler deploy`. Or run `npm run build` and `npm run deploy` separately.)

## Lint (TypeScript)

```bash
npm run lint
```
