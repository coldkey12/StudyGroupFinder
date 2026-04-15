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
  password_confirm = '';
  errorMessage = '';

  register(): void {
    this.errorMessage = '';

    if (this.password !== this.password_confirm) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      password_confirm: this.password_confirm
    }).subscribe({
      next: (response) => {
        this.authService.saveTokens(response.tokens.access, response.tokens.refresh);
        this.authService.saveUsername(response.username);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Registration failed';
      }
    });
  }
}