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
    <div class="login-root">
      <div class="login-left">
        <div class="brand">
          <div class="brand-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#4A1D96"/><path d="M8 20 Q14 8 20 20" stroke="#C9A84C" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="14" cy="13" r="2" fill="#fff"/></svg>
          </div>
          <span class="brand-name">Salon CRM</span>
        </div>
        <div class="left-body">
          <h1>Studio-grade<br><em>appointment management</em></h1>
          <p>One system for your calendar, clients, staff, and billing — built for the modern salon.</p>
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-dot"></span>
              <span>Visual weekly booking calendar</span>
            </div>
            <div class="feature-item">
              <span class="feature-dot"></span>
              <span>Instant bill generation &amp; sharing</span>
            </div>
            <div class="feature-item">
              <span class="feature-dot"></span>
              <span>Staff &amp; client management</span>
            </div>
          </div>
        </div>
        <div class="left-footer">© 2024 Salon CRM</div>
      </div>

      <div class="login-right">
        <div class="login-card">
          <div class="login-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your workspace</p>
          </div>

          <div *ngIf="error" class="alert alert-error">{{ error }}</div>

          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label>User ID</label>
              <input class="form-control" [(ngModel)]="userId" name="userId"
                     placeholder="e.g. admin" autocomplete="username" required />
            </div>
            <div class="form-group">
              <label>Password</label>
              <div class="password-wrap">
                <input class="form-control" [type]="showPw ? 'text' : 'password'"
                       [(ngModel)]="password" name="password"
                       placeholder="••••••••" autocomplete="current-password" required />
                <button type="button" class="pw-toggle" (click)="showPw = !showPw">
                  {{ showPw ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>
            <button class="btn btn-primary btn-login" type="submit" [disabled]="loading">
              <span *ngIf="!loading">Sign in</span>
              <span *ngIf="loading" class="spinner"></span>
            </button>
          </form>

          <div class="credentials-hint">
            <span class="hint-label">Demo credentials</span>
            <code>admin</code> / <code>admin123</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-root {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
    }

    /* Left panel */
    .login-left {
      background: #0D0D0F;
      padding: 40px 56px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .login-left::before {
      content: '';
      position: absolute;
      top: -120px; right: -120px;
      width: 420px; height: 420px;
      background: radial-gradient(circle, rgba(74,29,150,0.35) 0%, transparent 70%);
      pointer-events: none;
    }
    .login-left::after {
      content: '';
      position: absolute;
      bottom: -80px; left: -80px;
      width: 320px; height: 320px;
      background: radial-gradient(circle, rgba(185,134,11,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-mark {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
    }
    .brand-name {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      letter-spacing: -0.02em;
    }

    .left-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 48px 0;
    }
    .left-body h1 {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 40px;
      line-height: 1.15;
      color: #fff;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .left-body h1 em {
      font-style: italic;
      color: #C9A84C;
    }
    .left-body p {
      font-size: 15px;
      color: rgba(255,255,255,0.50);
      line-height: 1.7;
      max-width: 340px;
      margin-bottom: 36px;
    }

    .feature-list { display: flex; flex-direction: column; gap: 14px; }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13.5px;
      color: rgba(255,255,255,0.65);
    }
    .feature-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #C9A84C;
      flex-shrink: 0;
    }

    .left-footer {
      font-size: 12px;
      color: rgba(255,255,255,0.25);
    }

    /* Right panel */
    .login-right {
      background: #F7F5F2;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 32px;
    }

    .login-card {
      background: #fff;
      border-radius: 20px;
      padding: 44px 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 24px rgba(13,13,15,0.10), 0 0 0 1px rgba(13,13,15,0.05);
    }
    .login-card-header { margin-bottom: 32px; }
    .login-card-header h2 {
      font-family: 'DM Serif Display', serif;
      font-size: 26px;
      font-weight: 400;
      color: #0D0D0F;
      letter-spacing: -0.02em;
    }
    .login-card-header p {
      font-size: 13.5px;
      color: #7A7585;
      margin-top: 4px;
    }

    .password-wrap { position: relative; }
    .pw-toggle {
      position: absolute;
      right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 12px;
      font-weight: 600;
      color: #7A7585;
      cursor: pointer;
      letter-spacing: 0.03em;
    }
    .pw-toggle:hover { color: #4A1D96; }

    .btn-login {
      width: 100%;
      height: 44px;
      font-size: 14px;
      margin-top: 8px;
      border-radius: 8px;
    }

    .credentials-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #F0ECE7;
      font-size: 12.5px;
      color: #7A7585;
    }
    .hint-label {
      font-weight: 500;
      color: #B8B2AC;
    }
    code {
      background: #F7F5F2;
      border: 1px solid #E4DFD8;
      border-radius: 4px;
      padding: 2px 7px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 12px;
      color: #4A1D96;
    }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .login-root { grid-template-columns: 1fr; }
      .login-left { display: none; }
      .login-right { background: #0D0D0F; }
      .login-card { box-shadow: var(--shadow-lg); }
    }
  `]
})
export class LoginComponent {
  userId = '';
  password = '';
  loading = false;
  error = '';
  showPw = false;

  constructor(private auth: AuthService, private router: Router) { }

  onLogin() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.userId, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials. Please try again.';
        this.loading = false;
      }
    });
  }
}
