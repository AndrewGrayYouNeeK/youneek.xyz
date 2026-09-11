# YouNeeK.xyz

Personal portfolio site for Andrew Gray ([@AndrewGrayYouNeeK](https://github.com/AndrewGrayYouNeeK)).

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) components
- [React Router](https://reactrouter.com/)

This is a standalone static site. There is no Base44 (or other BaaS) dependency.

## Domain

Production is **https://youneek.xyz** (and `www.youneek.xyz`), served from Cloudflare Workers static assets.

The zone already uses Cloudflare nameservers. Deploy attaches those hostnames as Worker custom domains and lets Cloudflare issue the certificate.

```bash
npm run deploy
```

Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` locally **and** as GitHub Actions secrets. The token needs Workers edit plus Zone DNS edit for `youneek.xyz`.

## Preview site (pull requests)

Each pull request uploads a Worker **version** (it does not replace production) and gets a public [preview URL](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/):

- **Stable alias:** `<sanitized-branch>-youneek-xyz.<subdomain>.workers.dev`
- **Version URL:** unique per upload, printed in the GitHub Action log and on the PR comment

The workflow is `.github/workflows/preview.yml`. After the two Cloudflare secrets are set, open or update a PR and wait for the **Preview** check.

Locally (same Cloudflare credentials):

```bash
npm run preview:cf
# or a named alias:
npm run build && npx wrangler versions upload --preview-alias staging
```

Merging to `main` runs `.github/workflows/deploy.yml` (`wrangler deploy`) and updates **https://youneek.xyz**.

The old Vercel URL (`youneekxyz.vercel.app`) is disabled (payment required) and is no longer the origin.

## Local development

Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the local dev server           |
| `npm run build`    | Build the production bundle          |
| `npm run preview`  | Preview the production build locally |
| `npm run preview:cf` | Upload a Cloudflare preview version (no production change) |
| `npm run lint`     | Run ESLint                           |
| `npm run typecheck`| Run the TypeScript checker           |
| `npm run deploy`   | Build and deploy to youneek.xyz      |
