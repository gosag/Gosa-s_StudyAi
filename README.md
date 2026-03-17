# EchoLearn

> **AI-powered study platform** — learn smarter with AI summaries, quizzes, flashcards, and a personal tutor.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)

---

## 🔗 Demo / Live Link

> **Live App:** [Coming Soon](#)

---

## 📸 Screenshots

| Landing Page | Dashboard | Flashcards |
|---|---|---|
| _(placeholder)_ | _(placeholder)_ | _(placeholder)_ |

| Library | Quiz | AI Tutor |
|---|---|---|
| _(placeholder)_ | _(placeholder)_ | _(placeholder)_ |

---

## ✨ Features

- **AI Summaries** — Upload a PDF or paste a YouTube link and get a structured AI-generated summary instantly
- **Quiz Generation** — Auto-generated multiple-choice quizzes for active recall practice
- **AI Tutor** — Continue a conversation with the AI to get deeper explanations on any topic
- **Flashcards + Spaced Repetition** — SM-2 algorithm schedules cards for optimal long-term retention
- **Study Streak** — Track your daily study consistency
- **Library Management** — Organize, view, and delete your study materials
- **User Authentication** — Secure sign-up and login with JWT
- **Email Reminders** — Configurable study reminders via email
- **Clean SaaS UI** — Modern, responsive interface built with Tailwind CSS

---

## 🛠 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Tailwind CSS v4 | Utility-first styling |
| Vite | Build tool & dev server |
| React Router v7 | Client-side routing |
| React Hook Form + Zod | Form handling & validation |
| Framer Motion | Animations |
| shadcn/ui | Component library |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 + TypeScript | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| node-cron + Nodemailer | Scheduled email reminders |

### AI / External
| Tech | Purpose |
|---|---|
| Google Gemini AI | Summaries, quizzes, tutoring |
| youtube-transcript | YouTube caption extraction |
| pdf-parse | PDF text extraction |
| mammoth | DOCX text extraction |

---

## 🏗 Architecture Overview

```
Client (React SPA)
    │
    │  HTTP / REST
    ▼
Server (Express API)
    │
    ├── Auth middleware (JWT)
    ├── Zod validation
    ├── Multer (file uploads)
    │
    ├── Gemini AI Service ──► Google Gemini API
    └── MongoDB (Mongoose)
            ├── Users
            ├── Materials
            ├── Chats
            ├── Quizzes
            └── Flashcards
```

1. The React SPA handles all routing client-side and communicates with the Express API over REST.
2. Uploaded files (PDF, DOCX, TXT, MD, CSV) and YouTube links are processed server-side; raw text is extracted and sent to Gemini for structured JSON responses.
3. Flashcards use the SM-2 spaced repetition algorithm to schedule reviews, stored per-user in MongoDB.
4. JWT tokens are validated on every protected route via an auth middleware.

---

## 🚀 Installation

### Prerequisites

- Node.js ≥ 18
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google Gemini API key ([get one here](https://aistudio.google.com/))

---

### 1. Clone the repository

```bash
git clone https://github.com/gosag/Gosa-s_StudyAi.git
cd Gosa-s_StudyAi
```

---

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory (see [Environment Variables](#-environment-variables)):

```bash
cp .env.example .env
# then fill in the values
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

### 3. Frontend setup

```bash
cd ../client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

### 4. Run both simultaneously (from root)

```bash
# from the repo root
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `server/.env` file with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/echolearn

# Authentication
JWT_SECRET=YOUR_JWT_SECRET_HERE

# Google Gemini AI
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Email reminders (optional)
EMAIL_USER=YOUR_EMAIL_ADDRESS
EMAIL_PASS=YOUR_EMAIL_APP_PASSWORD

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📡 API Overview

All protected routes require a `Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT |
| `GET` | `/api/auth/:id` | Get authenticated user data |

### Materials & Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/uploads/file` | Upload a file (PDF, DOCX, TXT, MD, CSV) |
| `POST` | `/api/uploads/link` | Process a YouTube link |
| `GET` | `/api/materials` | Get all materials for the current user |
| `GET` | `/api/materials/:id` | Get a single material by ID |
| `DELETE` | `/api/delete/:id` | Delete a material |

### AI Tutor

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/continue` | Continue an AI conversation on a material |

### Quizzes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/quizzes/:id` | Get (or generate) quizzes for a material |
| `POST` | `/api/quizzes/regenerate/:id` | Force-regenerate quizzes for a material |

### Flashcards

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/flashcards/review` | Get flashcards due for review today |
| `PATCH` | `/api/flashcards/:id/review` | Submit a review result (SM-2 update) |

### User Settings & Streak

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/streak` | Get the user's current study streak |
| `PATCH` | `/api/settings/reminder` | Update email reminder preferences |

---

## 📁 Folder Structure

```
Gosa-s_StudyAi/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Page & UI components
│   │   │   ├── home.tsx        # Dashboard
│   │   │   ├── library.tsx     # Study materials library
│   │   │   ├── material.tsx    # Material detail + AI chat
│   │   │   ├── Quiz.tsx        # Quiz interface
│   │   │   ├── flashCard.tsx   # Flashcard review
│   │   │   ├── setting.tsx     # User settings
│   │   │   ├── login.tsx
│   │   │   ├── signUp.tsx
│   │   │   ├── landingPage.tsx
│   │   │   ├── outlet/         # Layout wrapper
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── lib/                # Utilities & helpers
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # DB connection & app config
│   │   ├── controllers/        # Route handler logic
│   │   ├── middleware/         # Auth & validation middleware
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── user.model.ts
│   │   │   ├── material.model.ts
│   │   │   ├── chat.model.ts
│   │   │   ├── quiz.model.ts
│   │   │   └── flashCard.model.ts
│   │   ├── routes/             # Express routers
│   │   │   ├── auth.routes.ts
│   │   │   └── upload.routes.ts
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # Gemini AI & business logic
│   │   └── types/              # Shared TypeScript types
│   ├── server.ts               # Entry point
│   └── package.json
│
├── package.json                # Root (runs both with concurrently)
└── README.md
```

---

## 🔮 Future Improvements

- [ ] Google / GitHub OAuth login
- [ ] Mobile app (React Native)
- [ ] Collaborative study rooms
- [ ] Support for image-based content (OCR)
- [ ] Progress analytics dashboard
- [ ] Export flashcards to Anki format
- [ ] Offline mode with service workers
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <a href="https://github.com/gosag">gosag</a></p>
