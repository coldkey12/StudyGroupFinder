import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Session {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  course_name: string;
  spots_remaining: number;
  is_active: boolean;
}

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-sessions.component.html',
  styleUrl: './my-sessions.component.css'
})
export class MySessionsComponent implements OnInit {
  sessions: Session[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Session[]>('http://localhost:8000/api/my-sessions/')
      .subscribe({
        next: (data) => { this.sessions = data; this.loading = false; },
        error: () => { this.error = 'Ошибка загрузки'; this.loading = false; }
      });
  }
}
