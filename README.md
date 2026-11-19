# KayaHub

**Live site:** [kayahub.co.ke](https://kayahub.co.ke)

KayaHub is a mobile-first rental housing marketplace for Kenya, built around trust. It connects tenants with landlords who post available properties, and gives admins the tools to review listings and keep the platform safe.

## Why KayaHub

Finding a rental in Kenya is hard. Listings are scattered across WhatsApp groups, Facebook pages, agents, posters and informal networks, and scams are a real risk. KayaHub puts listings in one place and adds trust layers: admin review of every listing, a Verified badge for properties an admin has checked, and a way for tenants to report suspicious listings.

## Features

### Tenants
- Create an account and log in
- Browse listings in a compact, mobile-friendly card grid
- Search by location and filter by price, bedrooms and bathrooms
- Save favorite listings
- Message landlords directly
- Report suspicious listings

### Landlords
- Create an account and log in
- Post and edit property listings with photos (compressed in the browser and validated on the server)
- Add a profile photo
- Manage listings and conversations from a dashboard

### Admins
- Review new listings, then approve or reject them
- Mark approved properties as Verified, or remove the badge
- Handle reports, including suspending reported listings
- Manage users and listings

### Trust and safety
- Listings start unverified. Only an admin can award the Verified badge, and rejecting or suspending a listing removes it
- Image uploads are checked for type and size on both the client and the server
- CSRF protection on sensitive actions
- Error monitoring with Sentry

## Tech stack

**Backend** (`backend/`)
- FastAPI, Uvicorn
- PostgreSQL, SQLAlchemy, Alembic migrations
- Pydantic
- JWT authentication
- Cloudinary for image storage
- Sentry for error monitoring

**Frontend** (`frontend/`)
- Next.js (App Router) with TypeScript
- Tailwind CSS
- Mobile-first, responsive design

**Hosting**
- Frontend on Vercel
- Backend and database on Render

## Project structure

```
backend/    FastAPI app (app/models, app/routes, app/utils, alembic migrations)
frontend/   Next.js app (src/app pages, src/components, src/lib API helpers)
```

## Running locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in your own values
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL and API_SERVER_URL
npm run dev
```

Never commit `.env` files or secrets.

## Roadmap

Next up is a deeper trust layer:
- Phone number and government ID verification for landlords
- Verified landlord badge
- Public landlord profile pages
- Landlord analytics (views, inquiries)
- Admin analytics

Longer term: notifications, saved searches, and more search filters.

## Status

KayaHub is live and in a closed beta with a small group of testers.

## Author

Built by Benjamin Karanja.
