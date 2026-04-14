import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommentService, Comment } from '../../core/services/comment.service';

interface Session {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  course_name: string;
  creator_name: string;
  max_participants: number;
  spots_remaining: number;
  is_active: boolean;
  is_joined?: boolean;
}

interface Participant {
  id: string;
  username: string;
}

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.css'
})
export class SessionDetailComponent implements OnInit {
  session: Session | null = null;
  comments: Comment[] = [];
  participants: Participant[] = [];
  commentText = '';
  loading = true;
  error = '';
  currentUserId: number | null = null;

  private api = 'http://localhost:8000/api';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadSession(id);
    this.loadComments(id);
    this.loadParticipants(id);
  }

  loadSession(id: string) {
    this.http.get<Session>(`${this.api}/sessions/${id}/`).subscribe({
      next: (data) => { this.session = data; this.loading = false; },
      error: () => { this.error = 'Ошибка загрузки'; this.loading = false; }
    });
  }

  loadComments(id: string) {
    this.commentService.getComments(id).subscribe({
      next: (data) => this.comments = data
    });
  }

  loadParticipants(id: string) {
    this.http.get<Participant[]>(`${this.api}/sessions/${id}/participants/`).subscribe({
      next: (data) => this.participants = data
    });
  }

  join() {
    if (!this.session) return;
    this.http.post(`${this.api}/sessions/${this.session.id}/join/`, {}).subscribe({
      next: () => { if (this.session) this.session.is_joined = true; this.loadParticipants(this.session!.id); },
      error: (e) => alert(e.error?.detail || 'Ошибка')
    });
  }

  leave() {
    if (!this.session) return;
    this.http.delete(`${this.api}/sessions/${this.session.id}/leave/`).subscribe({
      next: () => { if (this.session) this.session.is_joined = false; this.loadParticipants(this.session!.id); }
    });
  }

  sendComment() {
    if (!this.session || !this.commentText.trim()) return;
    this.commentService.addComment(this.session.id, this.commentText).subscribe({
      next: (c) => { this.comments.push(c); this.commentText = ''; }
    });
  }

  removeComment(id: string) {
    this.commentService.deleteComment(id).subscribe({
      next: () => this.comments = this.comments.filter(c => c.id !== id)
    });
  }
}
