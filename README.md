# CommutePodder

A web application that recommends podcasts based on your commute time in Stockholm. Choose your travel route using SL (Stockholm's public transport), and the app will suggest podcasts that perfectly match your journey duration.

**Deployed at:** https://commutepodderiprog.web.app/

## Project Description

CommutePodder helps commuters discover podcasts that fit their travel time. Users authenticate via Google, select their start and end stations within Stockholm's public transport network, and receive personalized podcast recommendations based on the calculated travel duration. The app uses the SL API for travel information and integrates with podcast services to provide relevant content suggestions.

## Setup Guide

### Prerequisites
- Node.js (v18 or later recommended)
- npm
- A Firebase project
- A ListenNotes API key
- Trafiklab (SL) API keys

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CommutePodder
   ```

2. **Install Dependencies**
   Run the following commands to install dependencies for the root, API, and Web workspaces:
   ```bash
   npm install
   cd api && npm install
   cd ../web && npm install
   cd ..
   ```

3. **Configuration**
   You need to create 4 configuration files.

   **A. Root Environment Variables (`.env`)**
   Create a `.env` file in the root directory based on `.env.example`:
   ```ini
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   LISTENNOTES_API_KEY=your_listennotes_api_key
   ```

   **B. Web Environment Variables (`web/.env`)**
   Create a `.env` file in the `web` directory based on `web/.env.example` with your Firebase config:
   ```ini
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   # ... other firebase config
   ```

   **C. Firebase Service Account (`serviceAccountKey.json`)**
   Generate a new private key from Firebase Console > Project Settings > Service Accounts, and save it as `serviceAccountKey.json` in the **root** directory.

   **D. API Firebase Config (`api/src/firebaseConfig.js`)**
   Create `api/src/firebaseConfig.js` based on `api/src/firebaseConfig.js.example` with your Firebase config (same values as web/.env but in JS object format).

4. **Running the Application**
   From the root directory, run:
   ```bash
   npm run dev
   ```
   This will start both the backend (port 3000) and frontend (port 5173) concurrently.

## Third-Party Components

### Frameworks & Libraries
- **React**: Used for building the user interface.
- **Express.js**: Used for the backend REST API.
- **Firebase**: Used for Authentication (Google Sign-In), Database (Firestore), and Hosting.
- **Tailwind CSS**: Used for styling the application.
- **React Router**: Used for client-side routing.
- **Vite**: Build tool and development server.
- **Axios**: Used for making HTTP requests to external APIs.

### External APIs
- **SL API (Trafiklab)**: Used to fetch real-time public transport routes and stop data in Stockholm.
- **ListenNotes API**: Used to search for podcasts and episodes based on duration and genre.

## Completed Features

### Backend
- ✅ Express.js REST API server with TypeScript
- ✅ Firebase Admin SDK integration
- ✅ Google OAuth authentication flow
- ✅ JWT-based session management
- ✅ CORS configuration for frontend integration
- ✅ User model with Firebase Firestore
- ✅ Health check endpoint
- ✅ Error handling middleware
- ✅ SL API integration preparation
- ✅ MVC architecture (Models, Controllers, Services, Routes)
- ✅ Complete SL API integration for route calculation
- ✅ Integrate podcast API (ListenNotes or similar)
- ✅ Implement podcast recommendation algorithm based on travel time
- ✅ Store user preferences and route history in Firestore
- ✅ Route history tracking
### Frontend
- ✅ React + Vite setup with TypeScript
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Google sign-in integration
- ✅ Login view with presenter pattern
- ✅ Navbar component
- ✅ Firebase client SDK integration
- ✅ Environment configuration
- ✅ Create podcast display/player interface
- ✅ Favouriting podcast works
- ✅ Display recent routes
- ✅ Favorite routes functionality
- ✅ User profile management
- ✅ Responsive mobile design (Sidebar menu)
- ✅ Podcast category filtering
- ✅ Loading states and error handling

### DevOps
- ✅ Monorepo structure with separate frontend/backend
- ✅ Concurrently setup for running both servers with one command
- ✅ TypeScript configuration for both projects
- ✅ Git ignore files properly configured
- ✅ Environment variable management
- ✅ Deploy backend to production (Firebase Functions)
- ✅ Deploy frontend to production (Firebase Hosting)

## Future Enhancements

- ⏳ Advanced podcast filtering (language, region)
- ⏳ Persistent in-app audio player across navigation
- ⏳ Offline support (PWA)
- ⏳ Unit and Integration tests
- ⏳ Social features (share routes/podcasts)

## Project Structure

```
CommutePodder/
├── .env                     # Root environment variables
├── package.json             # Runs both frontend & backend with concurrently
├── serviceAccountKey.json   # Firebase Admin credentials (gitignored)
│
├── api/                     # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── server.ts        # Express app entry point
│   │   ├── controllers/     # Request handlers (auth, user, travel, etc.)
│   │   ├── models/          # Data models (User, Firestore operations)
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Error handling, etc.
│   │   └── utils/           # JWT signing, validators
│   └── package.json
│
└── web/                     # Frontend (React + Vite)
    ├── src/
    │   ├── App.tsx          # Root component with routing
    │   ├── presenters/      # Logic layer (MVP pattern)
    │   ├── views/           # UI components
    │   └── services/        # Firebase auth helpers
    ├── .env                 # Frontend Firebase config
    └── package.json
```

## Key Architecture

**Backend (MVC Pattern):**
- `controllers/` - Handle HTTP requests/responses
- `models/` - Data structures and database operations
- `services/` - Reusable business logic
- `routes/` - API endpoint definitions

**Frontend (MVP Pattern):**
- `presenters/` - Manage state and logic
- `views/` - Pure presentational components
- `services/` - External API integrations

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router 7** - Navigation
- **Firebase SDK** - Authentication

### Backend
- **Node.js** - Runtime
- **Express 4** - Web framework
- **TypeScript** - Type safety
- **Firebase Admin SDK** - Authentication verification
- **Firestore** - Database
- **JWT** - Session management
- **TSX** - TypeScript execution

### APIs
- **SL API** - Stockholm public transport data
- **ListenNotes API** - Podcast search and metadata

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Google auth enabled
- Service account key from Firebase

### Installation

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install all project dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables:**
   
   Create `web/.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   Root `.env` already exists with default values.

4. **Add Firebase Admin credentials:**
   - Download service account key from Firebase Console
   - Save as `serviceAccountKey.json` in project root

### Development

Start both frontend and backend:
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Building for Production

```bash
npm run build
```

## Architecture Pattern

The project follows **MVP (Model-View-Presenter)** pattern on the frontend:
- **Model**: Application state and data structures
- **View**: Pure presentational React components
- **Presenter**: Logic layer connecting models and views

Backend follows **MVC (Model-View-Controller)**:
- **Model**: Data structures and database operations
- **View**: JSON responses
- **Controller**: Request handling and business logic
- **Service**: Reusable business logic layer

