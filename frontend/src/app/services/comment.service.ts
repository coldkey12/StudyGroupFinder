import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: string;
  session: string;
  author: { id: number; username: string };
  text: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private api = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getComments(sessionId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.api}/sessions/${sessionId}/comments/`);
  }

  addComment(sessionId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.api}/sessions/${sessionId}/comments/`, { text });
  }

  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.api}/comments/${id}/`);
  }
}
