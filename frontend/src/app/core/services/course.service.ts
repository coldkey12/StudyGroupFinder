import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  session_count?: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private api = 'http://localhost:8000/api/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.api}/`);
  }

  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.api}/${id}/`);
  }

  createCourse(data: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.api}/`, data);
  }
}
