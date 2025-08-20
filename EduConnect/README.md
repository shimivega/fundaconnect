# Funda-App Monorepo

Run locally:

1. Create `.env.local` at repo root with:
```
DATABASE_URL=postgres://...
SESSION_SECRET=dev-session
JWT_SECRET=dev-secret
CLIENT_ORIGIN=http://localhost:5000
```
2. Create `client/.env.local` with:
```
VITE_API_URL=http://localhost:5000
```
3. Install deps and start
```
npm i
npm run dev
```

Deploy:
- Frontend: set `VITE_API_URL` to backend URL
- Backend: set `DATABASE_URL`, `SESSION_SECRET`, `JWT_SECRET`, `CLIENT_ORIGIN`

