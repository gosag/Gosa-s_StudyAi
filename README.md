#  EchoStudy

> **Supercharge your learning with AI-powered study aids.**

EchoStudy is an AI-powered study platform designed to help users learn faster, retain information longer, and simplify complex topics. By transforming unstructured content like PDFs and YouTube videos into structured learning materials, EchoLearn provides an optimized path to mastery.

---

##  Demo & Live Link

- **Live Platform:** [https://gosa-s-study-ai-git-main-gosa-girmas-projects.vercel.app/](https://gosa-s-study-ai-git-main-gosa-girmas-projects.vercel.app/)
---

##  Screenshots

*(Replace these with actual screenshots of your application)*

| Dashboard | Study Session |
| --- | --- |
| ![Dashboard](https://via.placeholder.com/600x300?text=Dashboard+Screenshot) | ![Study Session](https://via.placeholder.com/600x300?text=Study+Session+Screenshot) |

| AI Flashcards | AI Tutor |
| --- | --- |
| ![Flashcards](https://via.placeholder.com/600x300?text=Flashcards+Screenshot) | ![Tutor](https://via.placeholder.com/600x300?text=AI+Tutor+Screenshot) |

---

##  Core Features

-  **Secure Authentication**  User signup and login powered by JWT.
-  **Interactive Dashboard**  Manage study sessions, history, and progress.
-  **Multimodal Uploads**  Process and synthesize information directly from PDFs and YouTube links.
-  **AI-Generated Materials**  Get perfectly structured JSON summaries, quizzes, and study guides via Gemini AI.
-  **Spaced Repetition (SM-2)**  Optimize long-term memory retention through smart flashcard scheduling.
-  **Interactive AI Tutor**  Ask questions and get detailed, context-aware explanations instantly.

---

##  Tech Stack

### Frontend
- **Framework:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript

### Database & Auth
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

### AI & Integrations
- **AI Engine:** Google Gemini AI

---

##  Architecture Overview

EchoStudy follows a modern client-server architecture:
1. The **React/TypeScript frontend** provides a sleek, responsive SaaS-style UI, communicating with the backend via RESTful APIs.
2. The **Node.js/Express backend** handles business logic, JWT authentication, and database interactions.
3. When a user uploads a PDF or provides a YouTube link, the backend extracts the content and interfaces with the **Gemini AI API**.
4. Gemini AI processes the content and returns **structured JSON data** (summaries, quizzes, flashcards), which is then stored in **MongoDB**.
5. The frontend fetches this data to render interactive study sessions, utilizing the **SM-2 algorithm** to dictate flashcard review schedules.

---

##  Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Google Gemini API Key

### 1. Clone the repository
git clone https://github.com/gosag/Gosa-s_StudyAi.git
cd EchoLearn
\\\

### 2. Setup the Backend
cd server
npm install
npm run dev

### 3. Setup the Frontend
cd client
npm install
npm run dev

---

##  Environment Variables

Create loosely-coupled environment variables by defining \.env\ files in both your \server/\ and \client/\ directories.

### Backend (\server/.env\)
\\\env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/echolearn
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
\\\

### Frontend (\client/.env\)
\\\env
VITE_API_BASE_URL=http://localhost:5000/api
\\\

---

##  API Overview

### Authentication
- \POST /api/auth/signup\ - Register a new user
- \POST /api/auth/login\ - Authenticate and receive a token

### Upload & Processing
- \POST /api/upload/pdf\ - Upload and process a PDF document
- \POST /api/upload/link\ - Provide a YouTube link for processing

### Materials & Study
- \GET /api/materials\ - Fetch all processed learning materials
- \GET /api/flashcards\ - Fetch flashcards due for review (SM-2)
- \POST /api/flashcards/review\ - Submit a review to update SM-2 spacing
- \POST /api/quiz/generate\ - Generate active recall questions

*(This is a high-level overview. A detailed Postman/Swagger collection will be added soon.)*

---

##  Folder Structure

\\\	ext
EchoLearn/
 client/                 # React Frontend
    public/             
    src/                
        assets/         
        components/     # UI & Feature components
        lib/            # Utilities
        main.tsx        # Entry point

 server/                 # Node.js/Express Backend
     src/
        config/         # Database configs
        controllers/    # Route controllers
        middleware/     # Auth & Error handling
        models/         # MongoDB schemas
        routes/         # Express routes
        schemas/        # Zod validation schemas
        services/       # Core business & AI logic
        app.ts          # Server entry point
     server.ts           
\\\

---

##  Future Improvements

- [ ] Export flashcards to Anki
- [ ] Group study sessions & multiplayer quizzes
- [ ] Support for audio/podcast transcriptions
- [ ] Analytics dashboard for learning streaks

---

##  Contributing

Contributions are always welcome! 
1. Fork the project.
2. Create your feature branch (\git checkout -b feature/AmazingFeature\).
3. Commit your changes (\git commit -m 'Add some AmazingFeature'\).
4. Push to the branch (\git push origin feature/AmazingFeature\).
5. Open a Pull Request.

---

##  License

Distributed under the MIT License. See \LICENSE\ for more information.
