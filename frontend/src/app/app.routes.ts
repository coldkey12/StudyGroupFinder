import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MySessionsComponent } from './features/my-sessions/my-sessions.component';
import { SessionListComponent } from './features/sessions/session-list.component';
import { SessionDetailComponent } from './features/sessions/session-detail.component';
import { SessionFormComponent } from './features/sessions/session-form.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'sessions', component: SessionListComponent, canActivate: [authGuard] },
  { path: 'sessions/new', component: SessionFormComponent, canActivate: [authGuard] },
  { path: 'sessions/:id', component: SessionDetailComponent, canActivate: [authGuard] },
  { path: 'sessions/:id/edit', component: SessionFormComponent, canActivate: [authGuard] },
  { path: 'my-sessions', component: MySessionsComponent, canActivate: [authGuard] }
];
