# RapidDrop — Delivery Partner (MWeb)

Mobile-first React web app for delivery executives to manage orders, go online/offline, track earnings, and update delivery status.

## Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Lucide React icons

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). Use mobile viewport or your phone on the same network.

## Usage

Open the app — orders load automatically from the API. Toggle **Online** on the home screen when ready to deliver. Tap an **order ID** to copy it.

## Features

- **Home** — Today's earnings, online/offline toggle, active delivery card
- **Orders** — Filter active / completed / all; tap for details
- **Order detail** — Items, pickup/drop, call customer, advance status (picked up → on the way → delivered)
- **Earnings** — Today, week, month summary
- **Profile** — Partner info, vehicle, logout

## Build

```bash
npm run build
npm run preview
```
