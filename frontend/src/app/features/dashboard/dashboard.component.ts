import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SessionService, Session } from '../../core/services/session.service';

interface UpcomingSession {
  id: string;
  title: string;
  day: string;
  time: string;
  room: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private sessionService = inject(SessionService);

  currentWeek: string[] = [];
  upcomingSessions: UpcomingSession[] = [];
  error = '';

  ngOnInit(): void {
    this.currentWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    this.sessionService.getSessions().subscribe({
      next: (sessions) => this.upcomingSessions = this.toUpcoming(sessions),
      error: () => { this.error = 'Failed to load upcoming sessions'; }
    });
  }

  private toUpcoming(sessions: Session[]): UpcomingSession[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sessions
      .filter(s => new Date(s.date) >= today)
      .slice(0, 6)
      .map(s => ({
        id: s.id,
        title: s.title,
        day: WEEKDAYS[new Date(s.date).getDay()],
        time: s.start_time.slice(0, 5),
        room: s.location
      }));
  }
}
