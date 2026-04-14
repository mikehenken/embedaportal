# Embed a portal (3D web component + Vite)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikehenken/embedaportal)

React Three Fiber “portal” frames shipped as a **`<portal-widget>`** custom element. **Vite** builds the app into `dist/`; **Cloudflare Workers** static assets serve `dist/`.

**Requirements:** GitHub repo must stay **public** for the Deploy to Cloudflare button.

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
