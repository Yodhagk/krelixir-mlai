# Krelixir Migration Platform

> AI-Powered Infrastructure Migration Platform for krelixir.ai

Krelixir helps organizations migrate from on-premises infrastructure to cloud environments using AI-driven analysis, cost optimization, and automated migration workflows.

---

## Architecture

```
krelixir-mlai/
├── frontend/          # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/         # Landing, Login, Dashboard, Inventory, Recommendations, AI Chat, Settings
│   │   ├── components/    # Reusable UI components (layout, dashboard, inventory, ai, ui)
│   │   ├── store/         # Zustand global state (auth, app)
│   │   ├── services/      # Axios API client
│   │   └── utils/         # Helpers, constants, sample data
├── backend/           # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/        # auth, dashboard, inventory, recommendations, ai
│   │   ├── middleware/     # JWT auth, error handling
│   │   ├── models/        # SQLite database (better-sqlite3)
│   │   └── data/          # Sample seed data
└── docs/              # API docs, deployment guide
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Install Dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env — at minimum set JWT_SECRET
```

### 3. Start Development

```bash
# Terminal 1 - Backend (auto-seeds demo data)
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 4. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Demo Credentials
| Email | Password |
|-------|----------|
| `demo@krelixir.ai` | `demo1234` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Routing | React Router v6 |
| State | Zustand |
| Charts | Recharts |
| Forms | React Hook Form |
| File Upload | React Dropzone |
| Backend | Node.js 20, Express 4 |
| Database | SQLite via better-sqlite3 |
| Auth | JWT (jsonwebtoken) |
| AI | OpenAI GPT-4o (with mock fallback) |
| File Parsing | Multer + csv-parse |

---

## Features

- **Dual Mode**: Client Dashboard + AI Agent Mode
- **Inventory Management**: Servers, Databases, Applications, Network  
- **Data Ingestion**: CSV/Excel upload, manual entry
- **AI Recommendations**: Migration strategy per asset (Rehost/Replatform/Refactor/Retire)
- **Cost Analysis**: Current vs projected with 64% savings potential
- **AI Chat**: Natural language interface powered by GPT-4o
- **Risk Assessment**: Automated risk scoring per asset
- **Dark/Light Mode**: Full theme support

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/inventory` | All inventory |
| POST | `/api/inventory` | Add asset |
| POST | `/api/inventory/upload` | Upload CSV |
| GET | `/api/recommendations` | AI recommendations |
| POST | `/api/recommendations/analyze` | Trigger re-analysis |
| POST | `/api/ai/chat` | AI chat message |
| GET | `/api/ai/history` | Chat history |

See [docs/API.md](docs/API.md) for full documentation.

---

## Deployment (Hostinger / krelixir.ai)

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. Upload frontend/dist/ to Hostinger public_html/

# 3. Deploy backend on VPS with PM2
cd backend && pm2 start server.js --name krelixir-api
```
<img width="1845" height="966" alt="image" src="https://github.com/user-attachments/assets/dec6a28e-a35b-4a02-86d4-81c4e8c7b04e" />
<img width="1805" height="906" alt="image" src="https://github.com/user-attachments/assets/d0bc91d4-08fb-4ff4-94bf-e95ce7f945d2" />
<img width="1822" height="762" alt="image" src="https://github.com/user-attachments/assets/91175da2-ab4b-4a7c-84dd-7b204d520d61" />
<img width="1619" height="670" alt="image" src="https://github.com/user-attachments/assets/e445cfd7-2177-4cca-bc6f-8b418e591501" />
<img width="1756" height="871" alt="image" src="https://github.com/user-attachments/assets/bd5359d9-f57a-48a5-94a2-194549c0c059" />
<img width="1911" height="900" alt="image" src="https://github.com/user-attachments/assets/0deb75ea-178f-4fcb-9b2c-8ca6d4ac22c2" />
<img width="1865" height="871" alt="image" src="https://github.com/user-attachments/assets/71c8e384-55fa-497a-b621-64de000ab7b8" />









See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the complete guide including Nginx config, SSL, and environment setup.

---

## License

MIT © 2025 Krelixir
