# ShopEasy Frontend (Angular 21)

Customer storefront + admin panel for the ShopEasy e-commerce app.

## Run
```bash
npm install
npm start        # http://localhost:4200
```
The backend must be running on http://localhost:8081 (see `src/app/core/api.ts`).

## Theme
All colours are CSS variables at the top of `src/styles.css`
(`--primary` orange, `--green`, `--red`, `--muted`, `--bg`). Change them there to re-colour the whole app.

## Hero images
`public/hero/*.svg` – replace with your own photos and update the `<img src>` paths in
`src/app/pages/store/home.component.html`.
