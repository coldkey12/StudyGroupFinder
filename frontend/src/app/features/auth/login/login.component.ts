import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';

  login(): void {
    this.errorMessage = '';

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.authService.saveTokens(response.access, response.refresh);
        this.authService.saveUsername(this.username);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.detail ||
          error?.error?.non_field_errors?.[0] ||
          'Login failed';
      }
    });
  }
}
