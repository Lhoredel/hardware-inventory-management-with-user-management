# Hardware Inventory Management System

React + Vite + CSS project organized into reusable components, context, layouts, pages, and services.

## Folder structure

```text
src/
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── StatCard.jsx
│   ├── DataTable.jsx
│   ├── Modal.jsx
│   ├── SearchBar.jsx
│   ├── Pagination.jsx
│   ├── ConfirmDialog.jsx
│   └── Toast.jsx
├── context/
│   └── AuthContext.jsx
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── StockInOut.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Requirements
- Node.js 20 LTS recommended
- VS Code
- npm

## Run the app
Open the project folder in VS Code, open Terminal > New Terminal, and run:

```bash
npm install
npm run dev
```

Open the Vite URL, usually http://localhost:5173.

## Demo account
- Username: `admin`
- Password: `admin123`

## Features
- Login/logout with protected routes
- Dashboard totals, low-stock count, and inventory value
- Product create, read, update, delete
- Search, category filter, and pagination
- Stock In / Stock Out with quantity validation
- Low-stock and inventory valuation reports
- CSV exports for inventory and transactions
- localStorage persistence

## Important
This is a frontend-only demo. Data is saved in the browser's localStorage. Demo authentication is not secure and does not support multiple users or devices. For real deployment, connect a secure backend API and database.


## Visual theme
The interface uses a dark fantasy-inspired palette with plum and midnight backgrounds, violet/magenta accents, decorative corner frames, Cinzel headings, and responsive layouts. Existing inventory pages and localStorage workflows are retained.


## User management (demo mode)
- Sign in with the seeded administrator: `admin` / `admin123`.
- Open **Users** in the sidebar to add, edit, search, activate/deactivate, and delete accounts.
- Roles available: `Admin` and `Staff`. Only Admin accounts can open User Management.
- User accounts persist in browser `localStorage`; they are not shared across devices or browsers.
- This demo stores passwords in browser storage and is not production-secure. Use a backend, password hashing, and server-side authorization before real deployment.
