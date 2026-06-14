import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="login-bg">
      <div class="login-card">
        <div class="login-logo">
          <div class="logo-icon">✂️</div>
          <h1>Salon CRM</h1>
          <p>Manage your salon with ease</p>
        </div>
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>User ID</label>
            <input class="form-control" [(ngModel)]="userId" name="userId" placeholder="Enter user ID" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password" [(ngModel)]="password" name="password" placeholder="Enter password" required />
          </div>
          <button class="btn btn-primary w-full" type="submit" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <p class="hint">Default credentials: <strong>admin</strong> / <strong>admin123</strong></p>
      </div>
    </div>
  `,
    styles: [`
    .login-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .login-card {
      background: #fff;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
    }
    .login-logo { text-align: center; margin-bottom: 32px; }
    .logo-icon { font-size: 48px; margin-bottom: 8px; }
    .login-logo h1 { font-size: 26px; font-weight: 800; color: #1e1b4b; }
    .login-logo p { color: #6b7280; font-size: 14px; margin-top: 4px; }
    .w-full { width: 100%; justify-content: center; padding: 12px; font-size: 15px; }
    .hint { text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af; }
    .hint strong { color: #7c3aed; }
  `]
})
export class LoginComponent {
    userId = '';
    password = '';
    loading = false;
    error = '';

    constructor(private auth: AuthService, private router: Router) { }

    onLogin() {
        this.error = '';
        this.loading = true;
        this.auth.login(this.userId, this.password).subscribe({
            next: () => this.router.navigate(['/']),
            error: (err) => {
                this.error = err.error?.message || 'Login failed';
                this.loading = false;
            }
        });
    }
}