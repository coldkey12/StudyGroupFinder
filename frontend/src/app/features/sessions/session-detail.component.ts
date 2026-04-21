import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SessionService, Session, Participant } from '../../core/services/session.service';
import { CommentService, Comment } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.css'
})
export class SessionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sessionService = inject(SessionService);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);

  session: Session | null = null;
  comments: Comment[] = [];
  participants: Participant[] = [];
  commentText = '';
  loading = true;
  error = '';

  get username(): string | null {
    return this.authService.getUsername();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Session not found';
      this.loading = false;
      return;
    }
    this.loadSession(id);
    this.loadComments(id);
    this.loadParticipants(id);
  }

  loadSession(id: string) {
    this.sessionService.getSession(id).subscribe({
      next: (data) => { this.session = data; this.loading = false; },
      error: () => { this.error = 'Failed to load session'; this.loading = false; }
    });
  }

  loadComments(id: string) {
    this.commentService.getComments(id).subscribe({
      next: (data) => this.comments = data
    });
  }

  loadParticipants(id: string) {
    this.sessionService.getParticipants(id).subscribe({
      next: (data) => this.participants = data
    });
  }

  join() {
    if (!this.session) return;
    this.sessionService.join(this.session.id).subscribe({
      next: () => {
        if (this.session) {
          this.session.is_joined = true;
          this.session.spots_remaining = Math.max(0, this.session.spots_remaining - 1);
          this.loadParticipants(this.session.id);
        }
      },
      error: (e) => alert(e?.error?.detail || 'Could not join this session')
    });
  }

  leave() {
    if (!this.session) return;
    this.sessionService.leave(this.session.id).subscribe({
      next: () => {
        if (this.session) {
          this.session.is_joined = false;
          this.session.spots_remaining += 1;
          this.loadParticipants(this.session.id);
        }
      },
      error: (e) => alert(e?.error?.detail || 'Could not leave this session')
    });
  }

  sendComment() {
    const text = this.commentText.trim();
    if (!this.session || !text) return;
    this.commentService.addComment(this.session.id, text).subscribe({
      next: (c) => { this.comments.push(c); this.commentText = ''; },
      error: () => alert('Could not post comment')
    });
  }

  removeComment(id: string) {
    this.commentService.deleteComment(id).subscribe({
      next: () => this.comments = this.comments.filter(c => c.id !== id)
    });
  }

  isOwner(): boolean {
    return !!this.session && this.session.creator_name === this.username;
  }

  deleteSession() {
    if (!this.session) return;
    if (!confirm('Delete this session?')) return;
    this.sessionService.deleteSession(this.session.id).subscribe({
      next: () => this.router.navigate(['/sessions']),
      error: () => alert('Could not delete this session')
    });
  }
}
