import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Session {
  id: string;
  title: string;
  description: string;
  course: { id: string; name: string };
  course_name: string;
  creator: string;
  creator_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  spots_remaining: number;
  is_active: boolean;
  is_overdue: boolean;
  duration_minutes: number;
  created_at: string;
  is_joined?: boolean;
}

export interface SessionFormData {
  title: string;
  description: string;
  course: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
}

export interface Participant {
  id: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private baseUrl = 'http://localhost:8000/api';
  private api = `${this.baseUrl}/sessions`;

  constructor(private http: HttpClient) {}

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.api}/`);
  }

  getSession(id: string): Observable<Session> {
    return this.http.get<Session>(`${this.api}/${id}/`);
  }

  createSession(data: SessionFormData): Observable<Session> {
    return this.http.post<Session>(`${this.api}/`, data);
  }

  updateSession(id: string, data: SessionFormData): Observable<Session> {
    return this.http.put<Session>(`${this.api}/${id}/`, data);
  }

  deleteSession(id: string): Observable<unknown> {
    return this.http.delete(`${this.api}/${id}/`);
  }

  join(id: string): Observable<unknown> {
    return this.http.post(`${this.api}/${id}/join/`, {});
  }

  leave(id: string): Observable<unknown> {
    return this.http.delete(`${this.api}/${id}/leave/`);
  }

  getParticipants(id: string): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.api}/${id}/participants/`);
  }

  getMySessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/my-sessions/`);
  }
}
