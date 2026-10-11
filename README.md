# 💼 JobPortal — MERN Stack Online Job Portal

A full-featured online job portal built with **MongoDB, Express.js, React.js (Vite), and Node.js** for a Full Stack Development college project.

---

## 🚀 Features

### For Job Seekers
- Register and login with JWT-secured authentication
- Browse and search all available jobs by title and location
- Filter jobs by type (Full-time, Remote, Internship, etc.)
- View detailed job descriptions
- Apply to jobs with an optional cover letter
- Track all applications and their statuses in real-time

### For Recruiters
- Register with company details
- Post new job listings
- Edit and delete their own jobs
- View all applicants per job with their details and cover letters
- Update application status (Pending → Reviewed → Accepted / Rejected)

### General
- Modern, responsive dark-theme UI
- Role-based protected routes
- JWT authentication (7-day expiry)
- Input validation and error handling
- Toast notifications for all actions

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18 + Vite |
| Styling | Vanilla CSS (dark theme, glassmorphism) |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
online portal/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/axios.js     # Axios with JWT interceptor
│   │   ├── components/      # Navbar, JobCard, SearchBar, JobForm, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   └── pages/           # Home, Login, Register, Jobs, JobDetail, PostJob, MyJobs, Applicants, MyApplications
│   └── package.json
│
└── server/                  # Node.js + Express backend
    ├── controllers/         # authController, jobController, applicationController
    ├── middleware/          # auth.js (JWT verify + role check)
    ├── models/              # User.js, Job.js, Application.js
    ├── routes/              # auth.js, jobs.js, applications.js
    ├── server.js
    ├── .env
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

### 1. Backend Setup

```bash
cd "online portal/server"
npm install
```

The `.env` file is already created with default values. Edit if needed:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jobportal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

Start the backend:
```bash
npm run dev
```
Server runs at: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd "online portal/client"
npm install
npm run dev
```
App runs at: `http://localhost:5173`

---

## 🖥️ Running in VS Code

Open **two terminals** in VS Code:

**Terminal 1 – Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd client
npm run dev
```

Then open your browser at **http://localhost:5173**

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs` | — | Get all jobs (search/filter/paginate) |
| GET | `/api/jobs/:id` | — | Get single job |
| GET | `/api/jobs/my-jobs` | Recruiter | Get recruiter's own jobs |
| POST | `/api/jobs` | Recruiter | Create job |
| PUT | `/api/jobs/:id` | Recruiter | Update job |
| DELETE | `/api/jobs/:id` | Recruiter | Delete job |

### Applications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/applications/:jobId/apply` | Seeker | Apply to job |
| GET | `/api/applications/mine` | Seeker | Get own applications |
| GET | `/api/applications/job/:jobId` | Recruiter | Get job applicants |
| PUT | `/api/applications/:id/status` | Recruiter | Update application status |

---

## 🎓 College Project Info

- **Project Name:** Online Job Portal
- **Tech Stack:** MERN (MongoDB, Express, React, Node.js)
- **Authentication:** JWT + bcrypt
- **Database:** MongoDB with Mongoose ODM
