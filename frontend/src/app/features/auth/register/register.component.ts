import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  password2 = '';
  errorMessage = '';

  register(): void {
    this.errorMessage = '';

    if (this.password !== this.password2) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      password2: this.password2
    }).subscribe({
      next: (response) => {
        this.authService.saveTokens(response.access, response.refresh);
        this.authService.saveUsername(this.username);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        const err = error?.error || {};
        this.errorMessage =
          err.username?.[0] ||
          err.email?.[0] ||
          err.password?.[0] ||
          err.password2?.[0] ||
          err.non_field_errors?.[0] ||
          err.detail ||
          'Registration failed';
      }
    });
  }
}
