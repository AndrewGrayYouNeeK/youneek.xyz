# YouNeeK.xyz

Personal portfolio site for Andrew Gray ([@AndrewGrayYouNeeK](https://github.com/AndrewGrayYouNeeK)).

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) components
- [React Router](https://reactrouter.com/)

This is a standalone static site.

## Domain

Production is **https://youneek.xyz** (and `www.youneek.xyz`), served from the `youneek-xyz` Worker static assets.

`relay.youneek.xyz` is the separate `youneek-share-relay` Worker. This project does not route or delete that hostname.

The zone is already on Cloudflare account `d74b0de637f4d9d9eb3efb9e13142784`. Deploy attaches `youneek.xyz` and `www.youneek.xyz` as Worker custom domains. Before that, the deploy script deletes only broken `A`, `AAAA`, and `CNAME` records on those two names so the custom domain can replace them. Mail, TXT, and every other hostname stay.

From a machine that is logged in with Wrangler, or that has `CLOUDFLARE_API_TOKEN` set:

```bash
npm run deploy
```

That command builds the site, repairs the two hostnames, then runs `npx wrangler deploy`. The token needs Workers edit plus Zone DNS edit for `youneek.xyz`. Add the same token and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets to let the main-branch workflow deploy.

## Adding a site

Edit `sites.config.json`. Under `repos`, add the GitHub repo name and a `sites` array of `https` URLs. The next build requests each URL and keeps the Visit site link only when the response is a live site.

## Preview site (pull requests)

Each pull request uploads a Worker **version** (it does not replace production) and gets a public [preview URL](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/):

- **Stable alias:** `<sanitized-branch>-youneek-xyz.<subdomain>.workers.dev`
- **Version URL:** unique per upload, printed in the GitHub Action log and on the PR comment

The workflow is `.github/workflows/preview.yml`. After the two Cloudflare secrets are set, open or update a PR and wait for the **Preview** check. If those secrets are unset, the check still builds the site and skips the upload.

Locally (same Cloudflare credentials):

```bash
npm run preview:cf
# or a named alias:
npm run build && npx wrangler versions upload --preview-alias staging
```

Merging to `main` runs `.github/workflows/deploy.yml` (`wrangler deploy`) and updates **https://youneek.xyz**.

The old Vercel URL (`youneekxyz.vercel.app`) is disabled (payment required) and is no longer the origin.

## Local development

Prerequisites: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the local dev server           |
| `npm run sync:repos` | Refresh repository cards from GitHub and recheck site URLs |
| `npm run build`    | Refresh cards, then build the production bundle |
| `npm run test`     | Check the card list, site links, and DNS replacement rules |
| `npm run preview`  | Preview the production build locally |
| `npm run preview:cf` | Upload a Cloudflare preview version (no production change) |
| `npm run lint`     | Run ESLint                           |
| `npm run typecheck`| Run the TypeScript checker           |
| `npm run deploy`   | Build, replace the broken apex DNS, and deploy to youneek.xyz |
