import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SessionService, SessionFormData } from '../../core/services/session.service';
import { CourseService, Course } from '../../core/services/course.service';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './session-form.component.html',
  styleUrl: './session-form.component.css'
})
export class SessionFormComponent implements OnInit {
  courses: Course[] = [];
  isEdit = false;
  sessionId = '';
  submitting = false;
  error = '';

  form: SessionFormData = {
    title: '',
    description: '',
    course: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_participants: 10
  };

  constructor(
    private sessionService: SessionService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe({
      next: (data) => this.courses = data
    });

    this.sessionId = this.route.snapshot.paramMap.get('id') || '';
    if (this.sessionId) {
      this.isEdit = true;
      this.sessionService.getSession(this.sessionId).subscribe({
        next: (s) => {
          this.form = {
            title: s.title,
            description: s.description,
            course: s.course.id,
            date: s.date,
            start_time: s.start_time,
            end_time: s.end_time,
            location: s.location,
            max_participants: s.max_participants
          };
        }
      });
    }
  }

  submit() {
    this.submitting = true;
    this.error = '';
    const request = this.isEdit
      ? this.sessionService.updateSession(this.sessionId, this.form)
      : this.sessionService.createSession(this.form);

    request.subscribe({
      next: (s) => this.router.navigate(['/sessions', s.id]),
      error: (e) => {
        this.error = this.formatError(e?.error);
        this.submitting = false;
      }
    });
  }

  private formatError(err: unknown): string {
    if (!err) return 'Could not save session';
    if (typeof err === 'string') return err;
    if (typeof err === 'object') {
      const parts: string[] = [];
      for (const [field, value] of Object.entries(err as Record<string, unknown>)) {
        const text = Array.isArray(value) ? value.join(', ') : String(value);
        parts.push(`${field}: ${text}`);
      }
      return parts.join(' | ') || 'Could not save session';
    }
    return 'Could not save session';
  }
}
