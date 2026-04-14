import { Routes } from '@angular/router';
import { MySessionsComponent } from './features/my-sessions/my-sessions.component';
import { SessionDetailComponent } from './features/sessions/session-detail.component';

export const routes: Routes = [
  { path: 'my-sessions', component: MySessionsComponent },
  { path: 'sessions/:id', component: SessionDetailComponent },
  { path: '', redirectTo: 'my-sessions', pathMatch: 'full' }
];
