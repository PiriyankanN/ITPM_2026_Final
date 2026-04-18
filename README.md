
# ITPM_2026_Final

# Student Living Assistant

Student Living Assistant is a beginner-friendly MERN stack project for managing room listings, room inquiries, food services, and bus route information.

## Tech Stack

- Frontend: React.js with Vite
- Backend: Node.js with Express.js
- Database: MongoDB Atlas
- Tools: GitHub, Jira, Postman
- Authentication: Not added yet, but JWT can be added later

## Features

- Accommodation Listing & Management
- Room Inquiry & Interaction
- Food Service & Meal Discovery
- Bus Route & Transport Information

## Folder Structure

```text
student-living-assistant/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|-- README.md
```

## Collections

- Users
- Rooms
- Inquiries
- FoodServices
- BusRoutes

## API Endpoints

- `POST /api/rooms`
- `GET /api/rooms`
- `PUT /api/rooms/:id`
- `DELETE /api/rooms/:id`
- `POST /api/inquiries`
- `GET /api/inquiries`
- `PUT /api/inquiries/:id`
- `POST /api/food`
- `GET /api/food`
- `POST /api/routes`
- `GET /api/routes`

## Setup Instructions

### 1. Install dependencies

```bash
cd server
npm install
```

```bash
cd client
npm install
```

### 2. Configure environment variables

Create `server/.env` from `server/.env.example`.

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

Create `client/.env` from `client/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the backend

```bash
cd server
npm run dev
```

### 4. Run the frontend

```bash
cd client
npm run dev
```

### 5. Open the app

Visit:

```text
http://localhost:5173
```

## Beginner Notes

- The backend separates models, controllers, and routes.
- The frontend uses simple pages and reusable components.
- JWT authentication is left out for now to keep the project simple.
- Postman can be used to test endpoints before extending the UI.
- Postman can be used to test endpoints before extending the UI.

