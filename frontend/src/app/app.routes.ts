import { Routes } from '@angular/router';
import { MySessionsComponent } from './components/my-sessions/my-sessions.component';

export const routes: Routes = [
  { path: 'my-sessions', component: MySessionsComponent },
  { path: '', redirectTo: 'my-sessions', pathMatch: 'full' }
];
