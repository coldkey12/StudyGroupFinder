import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SessionService, Session } from '../../core/services/session.service';

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './my-sessions.component.html',
  styleUrl: './my-sessions.component.css'
})
export class MySessionsComponent implements OnInit {
  private sessionService = inject(SessionService);

  sessions: Session[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.sessionService.getMySessions().subscribe({
      next: (data) => { this.sessions = data; this.loading = false; },
      error: () => { this.error = 'Failed to load sessions'; this.loading = false; }
    });
  }
}
