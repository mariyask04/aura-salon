import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-logo">
          <span class="logo-emoji">✂️</span>
          <span class="logo-text">Salon CRM</span>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/calendar" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📅</span> Calendar
          </a>
          <a routerLink="/appointments" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📋</span> Appointments
          </a>
          <a routerLink="/staff" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span> Staff
          </a>
          <a routerLink="/clients" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🧑‍🤝‍🧑</span> Clients
          </a>
          <a routerLink="/billing" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">💰</span> Billing
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ userInitial }}</div>
            <div>
              <div class="user-name">{{ userName }}</div>
              <div class="user-role">Admin</div>
            </div>
          </div>
          <button class="btn-logout" (click)="logout()">⏻</button>
        </div>
      </aside>
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }
    .sidebar {
      width: 240px;
      background: var(--sidebar-bg);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      z-index: 100;
    }
    .sidebar-logo {
      padding: 24px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .logo-emoji { font-size: 26px; }
    .logo-text { color: #fff; font-size: 18px; font-weight: 700; }
    .sidebar-nav { padding: 16px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--sidebar-text);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .nav-item.active { background: var(--primary); color: #fff; }
    .nav-icon { font-size: 16px; }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .user-info { display: flex; align-items: center; gap: 10px; }
    .user-avatar {
      width: 34px; height: 34px;
      background: var(--primary);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 14px;
    }
    .user-name { color: #fff; font-size: 13px; font-weight: 600; }
    .user-role { color: var(--sidebar-text); font-size: 11px; }
    .btn-logout {
      background: rgba(255,255,255,0.1);
      border: none;
      color: var(--sidebar-text);
      width: 32px; height: 32px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }
    .btn-logout:hover { background: var(--danger); color: #fff; }
    .main-content { margin-left: 240px; flex: 1; padding: 28px; }
  `]
})
export class HomeComponent {
  constructor(private auth: AuthService) {}
  get userName() { return this.auth.getCurrentUser()?.name || 'Admin'; }
  get userInitial() { return this.userName.charAt(0).toUpperCase(); }
  logout() { this.auth.logout(); }
}