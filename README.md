<div align="center">

# ⚔️ Code Battle

### A Real-Time Competitive Coding Platform

**Challenge your friends. Prove your skills. Win the arena.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Directory Structure](#-directory-structure)
- [Data Models](#-data-models)
- [API Reference](#-api-reference)
- [Real-Time Socket Events](#-real-time-socket-events)
- [Frontend Pages & Routes](#-frontend-pages--routes)
- [Battle Flow](#-battle-flow)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)

---

## 🎯 Overview

**Code Battle** is a real-time, head-to-head competitive coding platform where two developers face off by solving algorithmic problems simultaneously. Players can create or join battle rooms, configure custom match settings (difficulty, game mode, language constraints), and compete live — all within an in-browser Monaco-powered code editor.

The platform is built with a full-stack JavaScript architecture: **React + Vite** on the frontend, **Express.js** on the backend, **MongoDB** for persistence, and **Socket.IO** for seamless real-time communication between opponents.

---

## ✨ Features

### 🏟️ Battle System
- **Create Battle Rooms** — Configure room name, description, difficulty, number of questions, and battle mode
- **Public & Private Rooms** — Public rooms appear in the join lobby; private rooms require a 6-digit room code
- **Room Code Sharing** — Auto-generated 6-digit numeric room codes for easy sharing
- **Opponent Detection** — Real-time notification when an opponent joins your room

### ⚔️ Gameplay
- **Two Battle Modes:**
  - **Time Mode** — First to submit a correct solution wins the point
  - **Quality Mode** — Solutions are evaluated on correctness and efficiency
- **Configurable Difficulty** — Easy, Medium, or Hard questions
- **Question Bank** — Questions randomly selected from a curated JSON dataset filtered by difficulty
- **Custom Question Count** — Choose between 3 and 10 questions per battle
- **Language Settings** — Force both players to use the same language, or allow free choice

### 💻 Code Editor
- **Monaco Editor** — The same editor that powers VS Code, embedded directly in the browser
- **Multi-language Support** — Write and execute code in multiple programming languages
- **Syntax Highlighting** — Full language-aware highlighting via Monaco
- **Real-time Score Tracking** — Live score updates as each question is answered

### 👤 User System
- **Registration & Login** — Secure JWT-based authentication with bcrypt-hashed passwords
- **User Profile** — View your battle history with scores and opponent scores
- **Account Settings** — Update name, email, and password
- **Account Deletion** — Permanently delete your account

### 📊 Post-Battle
- **Winner Announcement** — Dedicated results screen showing the winner
- **Battle History** — Past records stored on user profiles with individual scores
- **Tie Handling** — Graceful handling of draw scenarios

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI component framework |
| Vite | 6 | Build tool and dev server |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility-first styling |
| @monaco-editor/react | 4.7 | In-browser code editor |
| Socket.IO Client | 4.8 | Real-time WebSocket communication |
| Axios | 1.9 | HTTP requests to the backend API |
| Lucide React | 0.503 | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.1 | REST API server |
| Socket.IO | 4.8 | Real-time bidirectional events |
| Mongoose | 8.14 | MongoDB ODM |
| JSON Web Token (JWT) | 9 | Stateless authentication |
| bcrypt | 5.1 | Password hashing |
| express-validator | 7.2 | Request body validation |
| cookie-parser | 1.4 | Cookie handling |
| dotenv | 16 | Environment variable management |
| cors | 2.8 | Cross-origin request policy |

### Database

| Technology | Purpose |
|---|---|
| MongoDB | Document database for users, battles, and questions |

---

## 🏗️ Project Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        CLIENT (React)                    │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  Pages   │  │   Contexts   │  │  Socket.IO Client  │ │
│  │ Landing  │  │ UserContext  │  │  (Real-time layer) │ │
│  │ Arena    │  │SocketContext │  └────────────────────┘ │
│  │ Profile  │  └──────────────┘                         │
│  └──────────┘                                            │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP (Axios) + WebSocket
┌────────────────────────▼─────────────────────────────────┐
│                     SERVER (Express)                     │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  Routes  │  │ Controllers  │  │  Socket.IO Server  │ │
│  │ /users   │  │  user.ctrl   │  │  (Real-time events)│ │
│  │ /battle  │  │  battle.ctrl │  └────────────────────┘ │
│  └──────────┘  └──────────────┘                         │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Services │  │  Middleware  │  │  Question Bank     │ │
│  │user.srvc │  │auth.middlewr │  │ QuestionData.json  │ │
│  │btl.srvc  │  └──────────────┘  └────────────────────┘ │
│  └──────────┘                                            │
└────────────────────────┬─────────────────────────────────┘
                         │ Mongoose
┌────────────────────────▼─────────────────────────────────┐
│                   MongoDB Atlas / Local                  │
│           Users  |  Battles  |  Questions                │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
Code-Battle/
├── client/                         # React frontend (Vite)
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── context/
│   │   │   ├── UserContext.jsx     # Global user state (auth user data)
│   │   │   └── SocketContext.jsx   # Global Socket.IO connection & helpers
│   │   │
│   │   ├── LandingPage.jsx         # Home page with hero, features, tech stack
│   │   ├── SignInPage.jsx          # Login page
│   │   ├── SignUpPage.jsx          # Registration page
│   │   ├── CreateRoom.jsx          # Battle room creation with full config UI
│   │   ├── JoinMatch.jsx           # Browse public rooms & join by code
│   │   ├── BattleArena.jsx         # Waiting room: shows opponent, room info, start control
│   │   ├── StartBattle.jsx         # Live battle: Monaco editor, questions, timer, scoring
│   │   ├── BattleWinner.jsx        # Post-battle results and winner announcement
│   │   ├── ProfilePage.jsx         # User profile, stats, battle history, settings
│   │   ├── UserProtectedWrapper.jsx# Auth guard — redirects unauthenticated users
│   │   ├── App.jsx                 # Root router with all route definitions
│   │   ├── main.jsx                # React entry point with context providers
│   │   ├── index.css               # Global base styles
│   │   ├── App.css                 # App-level styles
│   │   └── create-room-style.css   # Styles specific to the Create Room page
│   │
│   ├── index.html                  # HTML shell
│   ├── vite.config.js              # Vite + Tailwind + React plugin config
│   ├── eslint.config.js            # ESLint rules
│   └── package.json
│
├── server/                         # Express backend
│   ├── app.js                      # Express app setup (middleware, routes, DB)
│   ├── server.js                   # HTTP server entry point + Socket.IO init
│   ├── socket.js                   # All Socket.IO event handlers
│   ├── QuestionData.json           # Static question bank (filtered at battle start)
│   │
│   ├── routes/
│   │   ├── user.route.js           # User API routes with validation rules
│   │   └── battle.route.js         # Battle API routes with validation rules
│   │
│   ├── controllers/
│   │   ├── user.controller.js      # User CRUD + auth logic
│   │   └── battle.controller.js    # Battle lifecycle logic
│   │
│   ├── services/
│   │   ├── user.service.js         # User DB operations (create, find, update, delete)
│   │   └── battle.service.js       # Battle DB operations (create with roomCode generation)
│   │
│   ├── models/
│   │   ├── user.model.js           # Mongoose User schema + JWT/bcrypt methods
│   │   ├── battle.model.js         # Mongoose Battle schema
│   │   └── question.model.js       # Mongoose Question schema (for future DB integration)
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js      # JWT verification middleware (cookie + bearer token)
│   │
│   ├── db/
│   │   └── db.js                   # MongoDB connection setup
│   │
│   └── package.json
│
└── .gitignore
```

---

## 🗃️ Data Models

### User Model

```js
{
  fullname: {
    firstname: String,   // required, 3-50 chars
    lastname:  String,   // optional, 3-50 chars
  },
  email:    String,      // required, unique, 5-50 chars
  password: String,      // required, bcrypt-hashed, not returned by default
  socketId: String,      // updated on Socket.IO connection
  pastRecords: [{
    battleId:      ObjectId -> Battle,
    score:         Number,  // this user's score in that battle
    opponentScore: Number,  // opponent's score in that battle
  }]
}
```

**Methods:**
- `generateAuthToken()` — Signs a JWT with the user's `_id`
- `comparePassword(password)` — Compares plain text to bcrypt hash
- `hashPassword(password)` (static) — Hashes a plain text password

---

### Battle Model

```js
{
  battleName:           String,    // required
  description:          String,    // required
  createdBy:            ObjectId -> User,
  challenger:           ObjectId -> User,
  isPrivate:            Boolean,   // default false
  roomCode:             String,    // unique, 6-digit, auto-generated
  status:               'waiting' | 'in-progress' | 'completed',
  questionsNumber:      Number,    // 3 to 10
  isSameLanguage:       Boolean,   // force same language for both players
  allowedLanguages:     [String],  // empty = all allowed
  difficulty:           'easy' | 'medium' | 'hard',
  mode:                 'time' | 'quality',
  timeLimitPerQuestion: Number,    // default 300s (5 minutes)
  currentQuestionIndex: Number,    // default 0
  questions:            [Object],  // populated at battle start from QuestionData.json
  winner:               ObjectId -> User | null,
  user1SocketId:        String,    // creator's live socket ID
  user2SocketId:        String,    // challenger's live socket ID
  createdAt:            Date,
}
```

---

### Question Model (Schema)

```js
{
  title:          String,
  description:    String,
  difficulty:     'easy' | 'medium' | 'hard',
  inputFormat:    String,
  outputFormat:   String,
  constraints:    String,
  sampleInput:    String,
  sampleOutput:   String,
  testCases: [{
    input:          String,
    expectedOutput: String,
    visible:        Boolean,  // false = hidden test case
  }],
  timeLimit:        Number,  // default 2 seconds
  memoryLimit:      Number,  // default 128,000 KB
  allowedLanguages: [String],
  tags:             [String],
  createdAt:        Date,
}
```

---

## 📡 API Reference

All routes are prefixed with the base URL. Protected routes require a valid JWT either in the `token` cookie or the `Authorization: Bearer <token>` header.

### User Routes — `/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/users/register` | ❌ | Register a new user |
| `POST` | `/users/login` | ❌ | Login and receive JWT |
| `GET` | `/users/profile` | ✅ | Get the authenticated user's profile |
| `GET` | `/users/logout` | ✅ | Logout (clears token cookie) |
| `GET` | `/users/getOpponent/:socketId` | ✅ | Fetch opponent user by socket ID |
| `PUT` | `/users/updateSettings` | ✅ | Update name, email, or password |
| `DELETE` | `/users/deleteAccount` | ✅ | Permanently delete account |

#### `POST /users/register`

```json
// Request Body
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com",
  "password": "secret123"
}

// Response 201
{
  "user": { ... },
  "token": "<jwt>"
}
```

#### `POST /users/login`

```json
// Request Body
{ "email": "john@example.com", "password": "secret123" }

// Response 200
{
  "message": "logged in successfully",
  "user": { ... },
  "token": "<jwt>"
}
```

#### `PUT /users/updateSettings`

```json
// Request Body (all fields optional)
{
  "fullname": { "firstname": "Jane", "lastname": "Doe" },
  "email": "jane@example.com",
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

---

### Battle Routes — `/battle`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/battle/create` | ✅ | Create a new battle room |
| `GET` | `/battle/all` | ✅ | List all battle rooms |
| `DELETE` | `/battle/:id` | ✅ | Delete a battle by ID |
| `PATCH` | `/battle/leave/:id` | ✅ | Challenger leaves the room |
| `POST` | `/battle/start/:id` | ✅ | Start battle (assign random questions) |
| `PATCH` | `/battle/complete/:id` | ✅ | Mark battle as completed and record winner |

#### `POST /battle/create`

```json
// Request Body
{
  "battleName": "Speed Round",
  "description": "Who is faster?",
  "isPrivate": false,
  "questionsNumber": 5,
  "isSameLanguage": true,
  "allowedLanguages": ["javascript", "python"],
  "difficulty": "medium",
  "mode": "time"
}

// Response 201
{ "battle": { "roomCode": "482910", "status": "waiting", ... } }
```

#### `POST /battle/start/:id`

Randomly selects `questionsNumber` questions from `QuestionData.json` matching the battle's `difficulty`. Sets `status` to `"in-progress"` and stores the questions directly on the battle document.

#### `PATCH /battle/complete/:id`

```json
// Request Body
{ "scores": { "creator": 3, "challenger": 2 } }

// Response 200 — Returns populated battle with winner details
{
  "battle": {
    "status": "completed",
    "winner": { "_id": "...", "fullname": { ... } },
    "createdBy": { ... },
    "challenger": { ... }
  },
  "message": "Battle completed successfully."
}
```

---

## ⚡ Real-Time Socket Events

The server uses Socket.IO for all live battle coordination. The client connects on page load via `SocketContext` and remains connected throughout the session.

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `userId` | Register user with socket ID in DB on login |
| `battleRoom` | `roomId` | Join a socket.io room; assign socket IDs to battle document |
| `newQuestion` | `{ roomCode, question, ... }` | Broadcast next question to the room |
| `scoreUpdate` | `{ roomCode, scores }` | Broadcast updated scores to both players |
| `pointAwarded` | `{ roomCode, winner }` | Notify both players who won a point |
| `startBattle` | `{ roomCode, opponentSocketId }` | Tell the opponent to redirect to the live battle page |
| `battleCompleted` | `{ roomCode, ... }` | Notify both players the battle is over |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `opponentJoined` | `{ opponent: User }` | Sent to creator when challenger joins the room |
| `newQuestion` | `{ roomCode, question, ... }` | Forwarded to all room members |
| `scoreUpdate` | `{ roomCode, scores }` | Forwarded to all room members |
| `pointAwarded` | `{ roomCode, winner }` | Forwarded to all room members |
| `redirectToBattle` | `{ roomCode }` | Sent to opponent to trigger navigation to battle |
| `battleCompleted` | `{ roomCode, ... }` | Forwarded to all room members |

---

## 🖥️ Frontend Pages & Routes

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | `LandingPage` | ❌ | Hero section, features, tech stack showcase |
| `/login` | `SignInPage` | ❌ | Email/password login form |
| `/register` | `SignUpPage` | ❌ | Account creation form |
| `/create-room` | `CreateRoom` | ✅ | Full battle configuration UI |
| `/join-room` | `JoinMatch` | ✅ | Browse public rooms or enter a room code |
| `/rooms/:roomcode` | `BattleArena` | ✅ | Waiting lobby — opponent detection, start control |
| `/start-battle/:roomcode` | `StartBattle` | ✅ | Live battle — editor, questions, timer, scoring |
| `/battle-winner/:roomcode` | `BattleWinner` | ✅ | Results screen with winner announcement |
| `/profile` | `ProfilePage` | ✅ | User stats, battle history, account settings |

> Protected routes are wrapped in `UserProtectedWrapper`, which validates the JWT and redirects unauthenticated users to `/login`.

---

## ⚔️ Battle Flow

```
[Creator]                          [Server]                         [Challenger]
    |                                  |                                  |
    |-- POST /battle/create ---------->|                                  |
    |<- { battle, roomCode: "482910" }-|                                  |
    |                                  |                                  |
    |-- socket: join(userId) --------->|                                  |
    |-- socket: battleRoom("482910") ->|                                  |
    |   (assigned user1SocketId)       |                                  |
    |                                  |                                  |
    |                                  |<-- socket: battleRoom("482910") -|
    |                                  |   (assigned user2SocketId)       |
    |<-- socket: opponentJoined -------|                                  |
    |                                  |                                  |
    |-- POST /battle/start/:id ------->|                                  |
    |   (random questions selected)    |                                  |
    |<- { battle with questions } -----|                                  |
    |                                  |                                  |
    |-- socket: startBattle ---------->|-- socket: redirectToBattle ----->|
    |   (navigate to /start-battle)    |                                  |
    |                                  |                                  |
    |============= LIVE BATTLE ========================================== |
    |                                  |                                  |
    |-- socket: newQuestion ---------->|-- broadcast: newQuestion ------->|
    |-- socket: pointAwarded --------->|-- broadcast: pointAwarded ------>|
    |-- socket: scoreUpdate ---------->|-- broadcast: scoreUpdate ------->|
    |                                  |                                  |
    |-- socket: battleCompleted ------>|-- broadcast: battleCompleted --->|
    |-- PATCH /battle/complete/:id --->|                                  |
    |   (winner determined by scores)  |                                  |
    |                                  |                                  |
    |========= RESULTS  (/battle-winner/:roomcode) ====================== |
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone https://github.com/VidhitSikri/Code-Battle.git
cd Code-Battle
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/codebattle
JWT_SECRET_KEY=your_super_secret_key_here
```

Start the backend:

```bash
node server.js
```

The server will start on `http://localhost:3000`.

### 3. Setup the Client

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_BASE_URL=http://localhost:3000
```

Start the frontend dev server:

```bash
npm run dev
```

The client will be available at `http://localhost:5173`.

---

## 🔧 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ✅ | Port the Express server listens on (e.g., `3000`) |
| `MONGO_URI` | ✅ | Full MongoDB connection string |
| `JWT_SECRET_KEY` | ✅ | Secret key for signing and verifying JWTs |

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BASE_URL` | ✅ | Full URL of the backend server (e.g., `http://localhost:3000`) |

---

## 🌐 Deployment

The application is configured for deployment on [Render](https://render.com/).

**Frontend is deployed at:** `https://code-battle-frontend.onrender.com`

The backend CORS policy explicitly allows:
- `http://localhost:5173` (local Vite dev)
- `http://localhost:3000` (local dev)
- `https://code-battle-frontend.onrender.com` (production)

### Deploying to Render

**1. Server — Web Service:**
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables: `PORT`, `MONGO_URI`, `JWT_SECRET_KEY`

**2. Client — Static Site:**
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variable: `VITE_BASE_URL=<your-render-server-url>`

---

## 🔐 Authentication Details

- Passwords are hashed using **bcrypt** with a salt rounds factor of `10`
- Authentication tokens are **JSON Web Tokens (JWT)** signed with `JWT_SECRET_KEY`
- Tokens are stored in both an **HTTP cookie** (`token`) and **localStorage** on the client, and accepted by the server from either source
- The `authUser` middleware verifies the token on every protected route
- Passwords are excluded from all query results by default (`select: false` on the schema)

---

## 📝 License

This project is open source. Feel free to fork and build upon it.

---

<div align="center">

Built with ❤️ by **Vidhit Sikri**

</div>
