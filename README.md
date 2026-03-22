# Elegant and configurable personal homepage

## Quick start

```bash
pnpm install
pnpm dev
```

## Edit only these files

- `src/config/site.ts`
- `src/config/backgrounds.ts`
- `src/config/widgets.ts`
- `src/config/projects.ts`

These four files control the profile, hero text, avatar path, background rotation, widget layout/content, and pinned repositories.

## Deploy

### GitHub Pages

1. Fork the repository.
2. Push to `main`.
3. In repository settings, enable GitHub Pages and choose GitHub Actions as the source.
4. The included workflow at `.github/workflows/deploy-pages.yml` will build and publish automatically.

### Vercel

1. Import the forked repository into Vercel.
2. Keep the default Vite settings.
3. Deploy.

`vite.config.ts` automatically switches the `base` path for GitHub Pages builds and keeps `/` for local dev and Vercel.
