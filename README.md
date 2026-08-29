# YouNeeK.xyz

Personal portfolio site for Andrew Gray ([@AndrewGrayYouNeeK](https://github.com/AndrewGrayYouNeeK)).

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) components
- [React Router](https://reactrouter.com/)

This is a standalone Vite + React static site.

## Domain

Production is **https://youneek.xyz** (and `www.youneek.xyz`), served from Cloudflare Workers static assets.

The zone already uses Cloudflare nameservers. Deploy attaches those hostnames as Worker custom domains and lets Cloudflare issue the certificate.

```bash
npm run deploy
```

Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` locally (or later as GitHub Actions secrets). The token needs Workers edit plus Zone DNS edit for `youneek.xyz`.

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
| `npm run lint`     | Run ESLint                           |
| `npm run typecheck`| Run the TypeScript checker           |
