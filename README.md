# Elegant and configurable personal homepage

<p align="center">
  <img src="https://blog-static.eurekamxz.me/images/screenshot_20260322_164542.png" width="45%" />
  <img src="https://blog-static.eurekamxz.me/images/screenshot_20260322_233749.png" width="45%" />
</p>

## Quick start

```bash
pnpm install
pnpm dev
```

## Edit these files

- `src/config/site.ts`
- `src/config/backgrounds.ts`
- `src/config/widgets.ts`
- `src/config/projects.ts`

These four files control the profile, hero text, avatar path, background rotation, widget layout/content, and pinned repositories.

## Deploy

### GitHub Pages

1. Fork the repository.
2. Enable github pages workflow at `.github/workflows/deploy-pages.yml`
3. Push to `main`.
4. In repository settings, enable GitHub Pages and choose GitHub Actions as the source.
5. The included workflow at `.github/workflows/deploy-pages.yml` will build and publish automatically.

### Vercel

1. Import the forked repository into Vercel.
2. Keep the default Vite settings.
3. Deploy.

`vite.config.ts` automatically switches the `base` path for GitHub Pages builds and keeps `/` for local dev and Vercel.
