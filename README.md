# Embed a portal (3D web component + Vite)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikehenken/embedaportal)

React Three Fiber “portal” frames shipped as a **`<portal-widget>`** custom element. **Vite** builds the app into `dist/`; **Cloudflare Workers** static assets serve `dist/`.

**Requirements:** GitHub repo must stay **public** for the Deploy to Cloudflare button.

### Configure the repo so the first-time Deploy form can pre-fill

Cloudflare reads your **public repo** when someone opens the wizard from the button. Per [Deploy to Cloudflare — best practices](https://developers.cloudflare.com/workers/platform/deploy-buttons/#best-practices), do this:

| Requirement | Why |
|-------------|-----|
| **`package.json` → `scripts.build`** | Must exist and compile the app (here: `vite build` → `dist/`). **Name must be exactly `build`.** |
| **`package.json` → `scripts.deploy`** | Must deploy only (here: `wrangler deploy`). **Name must be exactly `deploy`.** Do **not** put `npm run build && …` in `deploy`—the platform runs build then deploy as two steps; chaining build inside `deploy` can confuse detection or run Vite twice. |
| **`wrangler.toml` at repo root** | Declares the Worker and **`[assets] directory = "./dist"`** (not a field on the web form). |
| **`wrangler` in `package.json`** | Listed so `npx wrangler deploy` (or `npm run deploy`) resolves the same version Workers Builds expects. |
| **`package-lock.json` committed** | Reproducible `npm ci` / install on their build runners. |
| **Deploy button URL** | Use `https://deploy.workers.cloudflare.com/?url=https://github.com/OWNER/REPO` with the app at **repo root** (or use Cloudflare’s documented subdirectory flow if the Worker lives in a subfolder). |

If the wizard still shows empty commands, enter **Build:** `npm run build` and **Deploy:** `npx wrangler deploy` manually—same outcome.

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
