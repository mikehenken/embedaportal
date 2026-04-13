# Embed a portal (3D web component + Vite)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikehenken/embedaportal)

React Three Fiber “portal” frames shipped as a **`<portal-widget>`** custom element. **Vite** builds the app into `dist/`; **Cloudflare Workers** static assets serve `dist/`.

**Requirements:** GitHub repo must stay **public** for the Deploy to Cloudflare button.

**Cloudflare Workers Builds:** set **Build command** to `npm run build` and **Deploy command** to `npx wrangler deploy` (or rely on defaults and confirm in the UI).

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
