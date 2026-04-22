# StudyGroupFinder — Defense Cheat Sheet

Short, practical reference for the 5–7 min defense. Every requirement maps to the exact `file:line` you can open to prove it.

---

## 1. Elevator pitch (memorize this)

> StudyGroupFinder is a web platform for KBTU students to create, discover and join study sessions for their courses. Users register, browse upcoming sessions, RSVP with one click, and leave comments on each session page. The backend is Django REST Framework with JWT auth; the frontend is Angular 19 with a custom interceptor and guard.

Unique angle: **course-aware RSVP with live spots-remaining** — each session is tied to a Course, rooms are limited by `max_participants`, and the same user cannot double-join (DB `unique_together` constraint).

---

## 2. Team (slide 1)

| Name | Role |
|---|---|
| Vladimir — Team Lead | Full-stack · Git, PostgreSQL, CORS/JWT, StudySession CRUD, Postman |
| Adina | Full-stack · Auth (register/login/logout), UserProfile, AuthGuard, Interceptor, Dashboard |
| Baigel | Full-stack · Courses, RSVP, Comments, CourseManager, styling |

---

## 3. How to run the project at defense

**Backend** (Django, port 8000):
```bash
cd backend
python -m venv venv && source venv/bin/activate    # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate            # also seeds 6 sample courses
python manage.py runserver
```

**Frontend** (Angular, port 4200):
```bash
cd frontend
npm install
npx ng serve
```

Open `http://localhost:4200`. Register a fresh user (e.g. `demo` / `StrongPass123!`) and the seeded courses show up in the Create Session dropdown.

**Postman:** import `backend/postman/StudyGroupFinder.postman_collection.json`. Run `Auth → Register` (or `Login`) first — the test script captures the JWT automatically for every other request.

---

## 4. FRONTEND requirements (slide 2 — one line each)

| Requirement | Where to point |
|---|---|
| **4 `(click)` events** | `navbar.component.html:12` (logout), `login.component.html:15` (login), `session-list.component.html:30` (join), `session-detail.component.html:23` (leave) |
| **4 form controls `[(ngModel)]`** | `login.component.html:12-13` (username, password), `register.component.html:13-15` (email, password, confirm), `session-form.component.html:11` (title), `:29` (date) |
| **3 named routes + navigation** | `app.routes.ts:13` (`login`), `:14` (`register`), `:15` (`dashboard`), `:16` (`sessions`), `:20` (`my-sessions`). Navigation: `navbar.component.html:8-11` (routerLink). Programmatic: `login.component.ts:32` (`this.router.navigate(['/dashboard'])`) |
| **`@if` usage** | `dashboard.component.html:21` (error), `navbar.component.html:7` (isAuthenticated), `session-detail.component.html:20` (Join vs Leave branch) |
| **`@for` usage** | `dashboard.component.html:10` (weekdays), `:30` (upcoming sessions), `my-sessions.component.html:18`, `session-detail.component.html:33` (participants), `:41` (comments) |
| **JWT authentication** | `core/interceptors/auth.interceptor.ts:10` attaches `Bearer <token>` to every request; on 401 it clears storage and redirects to `/login`. Guard: `core/guards/auth.guard.ts:9`. Token storage: `core/services/auth.service.ts:36` (`saveTokens`) |
| **1 Angular Service with HttpClient** | `core/services/auth.service.ts:16` (`private http = inject(HttpClient)`). Other services using HttpClient: `session.service.ts`, `course.service.ts`, `comment.service.ts` (all four are real HttpClient services) |
| **Error handling** | Template-level: `login.component.html:17-19` shows `errorMessage`, `session-form.component.html` shows `error`, `my-sessions.component.html:10` shows `error`. Logic: `login.component.ts:34-39` parses DRF error shapes (`error.detail`, `non_field_errors[0]`). Interceptor catches 401 globally: `auth.interceptor.ts:19` |

---

## 5. BACKEND requirements (slide 3 — one line each)

| Requirement | Where to point |
|---|---|
| **4 models (we have 5)** | `accounts/models.py:5` UserProfile · `courses/models.py:12` Course · `sessions_app/models.py:10` StudySession · `:60` RSVP · `:87` Comment |
| **1 custom model Manager** | `courses/models.py:7` `class CourseManager(models.Manager)` with `with_session_count()`. Used in `courses/views.py:14` (`Course.objects.with_session_count()`) |
| **2 ForeignKey relationships (we have 6)** | `sessions_app/models.py:16` (StudySession → Course) · `:22` (StudySession → User) · `:64` (RSVP → Session) · `:70` (RSVP → User) · `:91` (Comment → Session) · `:97` (Comment → User) |
| **2 `serializers.Serializer`** | `accounts/serializers.py:8` `RegisterSerializer` · `:36` `LoginSerializer` |
| **2 `serializers.ModelSerializer` (we have 5)** | `accounts/serializers.py:48` UserProfile · `courses/serializers.py:6` Course · `sessions_app/serializers.py:9` StudySession · `:85` RSVP · `:94` Comment |
| **Function-Based Views (FBV)** | `accounts/views.py:10` register · `:26` login · `:42` logout · `:62` profile · `sessions_app/views.py:98` join_session · `:116` leave_session · `:125` session_participants · `:132` my_sessions · `:142` delete_comment |
| **Class-Based Views (CBV)** | `courses/views.py:10` CourseListView · `:24` CourseDetailView · `sessions_app/views.py:14` SessionListView · `:42` SessionDetailView · `:78` CommentListView |
| **Token-based auth (JWT)** | `config/settings.py:24-27` (installed apps incl. `simplejwt` + blacklist) · `:87-94` `DEFAULT_AUTHENTICATION_CLASSES = [...JWTAuthentication]` · `:97-103` `SIMPLE_JWT` settings · Token issued in `accounts/views.py:16-22` via `RefreshToken.for_user(user)` |
| **4 CRUD operations (all on StudySession)** | **C** `sessions_app/views.py:35` POST `/api/sessions/` · **R** `:17` GET list and `:48` GET one · **U** `:55` PUT `/api/sessions/:id/` · **D** `:67` DELETE `/api/sessions/:id/` |
| **CORS (django-cors-headers)** | `config/settings.py:26` app registered · `:36` middleware · `:106-109` `CORS_ALLOWED_ORIGINS = ["http://localhost:4200"]` |
| **Link between objects and the authenticated user** | `sessions_app/serializers.py:75` `validated_data["creator"] = self.context["request"].user` · `sessions_app/views.py:92` `serializer.save(session=session, author=request.user)` · `:112` `RSVP.objects.create(session=session, user=request.user)` |

---

## 6. Live demo script (3 min, follow in this order)

1. **Register** a new user on `/register` → auto-login, lands on dashboard.
2. **Dashboard** shows week calendar + upcoming sessions pulled from API (*point at* `dashboard.component.html:30` for `@for`).
3. **Create Session** (`/sessions/new`) — fill title/course/date/time → Submit. On success redirects to session detail.
4. On the session detail page: click **Join** (spots counter goes down), post a **Comment**, then click **Leave**.
5. Open `/my-sessions` — shows only sessions the current user has joined.
6. **Logout** via navbar — JWT is blacklisted on the backend, user is booted to `/login`.

If a teacher asks "show me the JWT": open DevTools → Application → LocalStorage → `access` + `refresh`. Or show `Authorization: Bearer …` in the Network tab on any `/api/*` request.

---

## 7. Likely teacher questions + short answers

| Question | Short answer |
|---|---|
| *"Why did you split `courses` and `sessions_app` into separate Django apps?"* | Courses is a reusable catalog; sessions are scheduling events tied to it. Separate apps keep migrations and models focused. |
| *"What is the custom manager for?"* | `CourseManager.with_session_count()` annotates each course with how many sessions reference it, so the list endpoint returns `session_count` without an N+1 query. |
| *"How is CORS enforced?"* | `corsheaders` middleware is above `CommonMiddleware` so preflight is short-circuited. We allow-list `http://localhost:4200` only — other origins get a 403 on preflight. |
| *"How do you protect a route on the frontend?"* | `authGuard` in `core/guards/auth.guard.ts` runs `isAuthenticated()` before activation; routes that require login use `canActivate: [authGuard]` in `app.routes.ts`. |
| *"Why JWT and not session auth?"* | Frontend and backend live on different origins, JWT is stateless and easy to send in an `Authorization` header; refresh tokens can be blacklisted on logout (we do that in `accounts/views.py:48`). |
| *"What happens if a user tries to join a full session?"* | `sessions_app/views.py:109` checks `rsvps.count() >= max_participants` and returns `400 {"detail": "Session is full."}`. |
| *"What prevents duplicate RSVPs?"* | `sessions_app/models.py:79` `unique_together = ("session", "user")` at the DB level, plus an explicit check in the view. |
| *"Where do you link the authenticated user to a created object?"* | Three places: session creator in `serializers.py:75`, comment author in `views.py:92`, RSVP user in `views.py:112`. |
| *"Why do the session list and detail use different template syntax?"* | Session list uses the older `*ngIf`/`*ngFor`; everywhere else we migrated to the new Angular 19 `@if`/`@for` block syntax. Both are supported. |

---

## 8. What each file does (quick map)

**Backend**
- `backend/config/settings.py` — Django settings, DRF + JWT + CORS config.
- `backend/config/urls.py` — root URL routing; mounts `/api/auth`, `/api/courses`, `/api/sessions`, `/api/my-sessions`, `/api/comments/:id`.
- `backend/accounts/` — User auth: registration, login, logout, profile. `UserProfile` model is a one-to-one extension of Django's `User`.
- `backend/courses/` — `Course` model + `CourseManager`. List/detail via CBVs.
- `backend/sessions_app/` — `StudySession`, `RSVP`, `Comment`. Full CRUD on sessions (CBV), join/leave/participants/my-sessions/delete-comment (FBVs).
- `backend/postman/` — the collection to import in Postman.

**Frontend**
- `src/app/app.routes.ts` — all named routes + guard wiring.
- `src/app/app.config.ts` — where the HTTP interceptor is registered.
- `src/app/core/services/` — `auth.service.ts`, `session.service.ts`, `course.service.ts`, `comment.service.ts`. All call `/api/...` with HttpClient.
- `src/app/core/interceptors/auth.interceptor.ts` — attaches Bearer token, handles 401.
- `src/app/core/guards/auth.guard.ts` — blocks private routes when not logged in.
- `src/app/features/auth/` — login + register components.
- `src/app/features/dashboard/` — home screen: weekly calendar + upcoming sessions.
- `src/app/features/sessions/` — list, detail, and create/edit form for study sessions.
- `src/app/features/my-sessions/` — sessions the current user has joined.
- `src/app/shared/navbar/` — the top navigation bar, visible on every authenticated page.

---

## 9. If something breaks on stage

- **"Cannot connect to backend / CORS error"** — check `python manage.py runserver` is alive on 8000 and `CORS_ALLOWED_ORIGINS` includes `http://localhost:4200`.
- **"Course dropdown is empty"** — run `python manage.py migrate` (the 0002 data migration seeds 6 courses).
- **"401 on every request"** — token expired (30 min). Just log out and log back in.
- **"No sessions at all"** — create one yourself, or have a teammate create one while you're demoing.
