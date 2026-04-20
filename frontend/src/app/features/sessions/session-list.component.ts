import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionService, Session } from '../../core/services/session.service';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.css'
})
export class SessionListComponent implements OnInit {
  sessions: Session[] = [];
  loading = true;
  error = '';

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.getSessions().subscribe({
      next: (data) => { this.sessions = data; this.loading = false; },
      error: () => { this.error = 'Failed to load sessions'; this.loading = false; }
    });
  }

  join(session: Session) {
    this.sessionService.join(session.id).subscribe({
      next: () => { session.is_joined = true; session.spots_remaining--; },
      error: (e) => alert(e.error?.detail || 'Error joining session')
    });
  }

  leave(session: Session) {
    this.sessionService.leave(session.id).subscribe({
      next: () => { session.is_joined = false; session.spots_remaining++; }
    });
  }
}
