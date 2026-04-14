# Embed a portal (3D web component + Vite)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikehenken/embedaportal)

React Three Fiber “portal” frames shipped as a **`<portal-widget>`** custom element. **Vite** builds the app into `dist/`; **Cloudflare Workers** static assets serve `dist/`.

**Requirements:** GitHub repo must stay **public** for the Deploy to Cloudflare button.

**Deploy to Cloudflare (GitHub button):** the wizard often **does not** infer a Vite build. You must set **Build command** to `npm run build` (install + build is handled if the template runs `npm install` first; otherwise use `npm ci && npm run build`). Set **Deploy command** to `npx wrangler deploy`. If you skip the build step, `dist/` is wrong or empty even though `wrangler.toml` correctly says `[assets] directory = "./dist"` — that path is **not** a field in the button form; Wrangler reads it from the repo. The form only needs to **produce** `dist/` before deploy runs.

## Develop

```bash
npm install
npm run dev
```

## Production build + deploy (CLI)

```bash
npm install
npm run deploy
```

## Lint (TypeScript)

```bash
npm run lint
```
