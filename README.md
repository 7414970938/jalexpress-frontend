# JalExpress Frontend

React web app (mobile-responsive) matching your Figma design — works on both phone browsers and desktop.

## What's included

**Customer app:**
- Role select -> Phone/OTP login
- Home (search + browse suppliers by service type)
- Supplier detail (badges, price list)
- Book tanker (type, size, address, payment method)
- Booking confirmed -> Order tracking (live status steps)
- My Orders (All/Ongoing/Completed/Cancelled tabs, Reorder, Rate)
- Profile (addresses, settings menu, logout)

**Owner (Service Provider) app:**
- Onboarding (business name, services offered, service areas)
- Price list setup
- Dashboard (earnings, orders, deliveries, rating, online/offline toggle)
- Orders (accept/reject/update status: booked -> accepted -> in transit -> delivered)
- Earnings (today/yesterday/7 days/last month breakdown)
- Profile/Settings

## Setup (local testing)

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Create `.env` file:
   ```
   cp .env.example .env
   ```
   Make sure `REACT_APP_API_URL` points to your backend (local: `http://localhost:5000/api`)

3. Run:
   ```
   npm start
   ```
   Opens at `http://localhost:3000`

   Make sure the **backend is running first** (see backend/README.md), otherwise API calls will fail.

## Testing the full flow

1. On the role screen, pick **Service Provider** first and log in with any 10-digit number (OTP will show on screen in dev mode — no real SMS needed).
2. Complete onboarding (business name, services, areas) and set prices.
3. Open the app again in a new browser tab/incognito, pick **Customer**, log in with a different number.
4. Search/browse — you should see the supplier you just onboarded. Book a tanker.
5. Switch back to the owner tab, go to Orders, accept -> start delivery -> mark delivered.
6. Switch to customer tab, track the order, rate it once delivered.

## Deploying for free (once ready)

**Vercel (recommended):**
1. Push this `frontend` folder to a GitHub repo
2. Go to vercel.com -> New Project -> import the repo
3. Add environment variable `REACT_APP_API_URL` = your deployed backend URL + `/api`
4. Deploy — you'll get a free `.vercel.app` URL

This works as a mobile web app immediately (people can open it in their phone browser, and even "Add to Home Screen" for an app-like icon). A true installable Android/iOS app (Play Store/App Store) can be wrapped around this same code later using React Native or a WebView wrapper — let me know when you're ready for that step.
