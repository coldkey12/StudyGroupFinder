# 📚 StudyGroupFinder

A web platform for KBTU students to create, discover, and join study sessions for their courses.

Built with **Angular 19 LTS** + **Django REST Framework** + **PostgreSQL**.

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| Vladimir | **Team Lead** / Full-Stack | Git, infrastructure, PostgreSQL, CORS/JWT setup, StudySession CRUD, Postman collection |
| Adina | Full-Stack | Authentication (register/login/logout), UserProfile, AuthGuard, Interceptor, Dashboard |
| Baigel | Full-Stack | Courses, RSVP, Comments, CourseManager, CSS styling |

**Practice Lesson:** _[your section]_

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19 LTS, TypeScript, FormsModule, HttpClient |
| Backend | Django 5, Django REST Framework |
| Database | PostgreSQL |
| Auth | JWT (djangorestframework-simplejwt) |
| API Docs | Postman Collection |

---

## 📁 Project Structure

```
StudyGroupFinder/
├── backend/
│   ├── config/              # settings.py, urls.py, wsgi.py
│   ├── accounts/            # UserProfile model, auth views (FBV)
│   │   ├── models.py
│   │   ├── serializers.py   # LoginSerializer, RegisterSerializer
│   │   ├── views.py         # register, login, logout, profile
│   │   └── urls.py
│   ├── courses/             # Course model + CourseManager
│   │   ├── models.py
│   │   ├── serializers.py   # CourseSerializer
│   │   ├── views.py         # CourseListView, CourseDetailView (CBV)
│   │   └── urls.py
│   ├── sessions_app/        # StudySession, RSVP, Comment
│   │   ├── models.py
│   │   ├── serializers.py   # StudySessionSerializer, RSVPSerializer, CommentSerializer
│   │   ├── views.py         # SessionListView, SessionDetailView (CBV)
│   │   │                    # join_session, leave_session (FBV)
│   │   └── urls.py
│   ├── postman/             # StudyGroupFinder.postman_collection.json
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   └── src/app/
│       ├── core/
│       │   ├── services/        # auth, session, course, comment
│       │   ├── interceptors/    # auth.interceptor.ts
│       │   ├── guards/          # auth.guard.ts
│       │   └── models/          # TypeScript interfaces
│       ├── features/
│       │   ├── auth/            # LoginComponent, RegisterComponent
│       │   ├── dashboard/       # DashboardComponent (calendar view)
│       │   ├── sessions/        # List, Detail, Form components
│       │   └── my-sessions/     # MySessionsComponent
│       ├── shared/              # Pipes, directives, shared UI
│       ├── app.routes.ts
│       └── app.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Angular CLI 19

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/StudyGroupFinder.git
cd StudyGroupFinder/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create PostgreSQL database
createdb studygroupfinder

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd StudyGroupFinder/frontend

# Install dependencies
npm install

# Start dev server
ng serve
```

Frontend runs at `http://localhost:4200`

---

## 🔗 API Endpoints

Base URL: `http://localhost:8000/api/`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login, returns JWT tokens |
| POST | `/api/auth/logout/` | Logout, invalidate refresh token |
| GET | `/api/auth/profile/` | Get current user profile |
| PUT | `/api/auth/profile/` | Update profile |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/` | List all courses |
| POST | `/api/courses/` | Create a course |
| GET | `/api/courses/:id/` | Course details |

### Study Sessions (Full CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions/` | List sessions (filters: `?course=`, `?date=`, `?search=`) |
| POST | `/api/sessions/` | Create a session |
| GET | `/api/sessions/:id/` | Session details |
| PUT | `/api/sessions/:id/` | Update session (owner only) |
| DELETE | `/api/sessions/:id/` | Delete session (owner only) |

### RSVP

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions/:id/join/` | Join a session |
| DELETE | `/api/sessions/:id/leave/` | Leave a session |
| GET | `/api/sessions/:id/participants/` | List participants |
| GET | `/api/my-sessions/` | Current user's RSVPs |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions/:id/comments/` | List comments for a session |
| POST | `/api/sessions/:id/comments/` | Add a comment |
| DELETE | `/api/comments/:id/` | Delete own comment |

> 📬 Full request/response examples are in `backend/postman/StudyGroupFinder.postman_collection.json`

---

## 🗄 Database Models

```
UserProfile  ──OneToOne──▶  User (Django built-in)

Course
  └── CourseManager (custom: with_session_count)

StudySession
  ├── FK → Course
  └── FK → User (creator)

RSVP
  ├── FK → StudySession
  └── FK → User
  └── unique_together: (session, user)

Comment
  ├── FK → StudySession
  └── FK → User (author)
```

---

## 📋 Requirements Coverage

| Requirement | Status |
|------------|--------|
| ≥ 4 Django models | ✅ 5 models |
| ≥ 2 ForeignKey relationships | ✅ 4 FKs |
| 1 custom model Manager | ✅ CourseManager |
| ≥ 2 `serializers.Serializer` | ✅ LoginSerializer, RegisterSerializer |
| ≥ 2 `serializers.ModelSerializer` | ✅ Course, StudySession, RSVP, Comment |
| ≥ 2 Function-Based Views | ✅ register, login, logout, profile, join, leave |
| ≥ 2 Class-Based Views (APIView) | ✅ CourseList, CourseDetail, SessionList, SessionDetail, CommentList |
| JWT auth + login/logout | ✅ SimpleJWT + Interceptor |
| Full CRUD ≥ 1 model | ✅ StudySession |
| `request.user` on create | ✅ sessions, comments, RSVPs |
| CORS configured | ✅ django-cors-headers |
| Postman collection | ✅ `backend/postman/` |
| ≥ 4 `(click)` events | ✅ login, create, join, leave, comment, delete |
| ≥ 4 `[(ngModel)]` controls | ✅ username, password, title, course, date, commentText |
| ≥ 3 named routes | ✅ 7 routes |
| `@for` / `@if` | ✅ lists + conditional buttons |
| ≥ 1 Service with HttpClient | ✅ 4 services |
| Error handling in UI | ✅ error messages on failed requests |

---

## 🌿 Git Workflow

- **main** — stable, production-ready code
- **develop** — integration branch
- **feature/*** — one branch per task

```
feature/auth       →  PR  →  develop  →  (tested)  →  main
feature/sessions   →  PR  →  develop
feature/courses    →  PR  →  develop
```

Commit message format:
```
feat: add session CRUD endpoints
fix: cors headers for preflight requests
docs: update README with API endpoints
style: dashboard component styling
```

---

## 📄 License

This project is developed as a coursework assignment for KBTU Web Development course.
