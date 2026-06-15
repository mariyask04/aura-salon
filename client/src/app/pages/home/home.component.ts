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
        <div class="sidebar-brand">
          <div class="s-logo">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#4A1D96"/>
              <path d="M8 20 Q14 8 20 20" stroke="#C9A84C" stroke-width="2" fill="none" stroke-linecap="round"/>
              <circle cx="14" cy="13" r="2" fill="#fff"/>
            </svg>
          </div>
          <span>Salon CRM</span>
        </div>

        <div class="sidebar-section">
          <span class="section-label">Workspace</span>
          <nav>
            <a routerLink="/calendar" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
              Calendar
            </a>
            <a routerLink="/appointments" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
              Appointments
            </a>
          </nav>
        </div>

        <div class="sidebar-section">
          <span class="section-label">Manage</span>
          <nav>
            <a routerLink="/staff" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
              Staff
            </a>
            <a routerLink="/clients" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
              Clients
            </a>
            <a routerLink="/billing" routerLinkActive="active" class="nav-link">
              <svg class="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/></svg>
              Billing
            </a>
          </nav>
        </div>

        <div class="sidebar-user">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-meta">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">Administrator</div>
          </div>
          <button class="logout-btn" (click)="logout()" title="Sign out">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }

    /* Sidebar */
    .sidebar {
      width: 224px;
      background: var(--sidebar);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      z-index: 100;
      border-right: 1px solid var(--sidebar-border);
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 22px 20px 20px;
      border-bottom: 1px solid var(--sidebar-border);
    }
    .s-logo { flex-shrink: 0; line-height: 0; }
    .sidebar-brand span {
      font-size: 14.5px;
      font-weight: 600;
      color: rgba(255,255,255,0.92);
      letter-spacing: -0.01em;
    }

    .sidebar-section { padding: 20px 12px 4px; }
    .section-label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.25);
      padding: 0 8px;
      margin-bottom: 6px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 9px 10px;
      border-radius: 7px;
      color: rgba(255,255,255,0.50);
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 450;
      transition: color 0.15s, background 0.15s;
      margin-bottom: 1px;
    }
    .nav-link:hover {
      color: rgba(255,255,255,0.85);
      background: rgba(255,255,255,0.06);
    }
    .nav-link.active {
      color: #fff;
      background: rgba(255,255,255,0.10);
      font-weight: 500;
    }
    .nav-link.active .nav-icon { color: #C9A84C; }
    .nav-icon {
      width: 16px; height: 16px;
      flex-shrink: 0;
      transition: color 0.15s;
    }

    .sidebar-user {
      margin-top: auto;
      padding: 16px;
      border-top: 1px solid var(--sidebar-border);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-avatar {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, #4A1D96, #6D28D9);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }
    .user-meta { flex: 1; min-width: 0; }
    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.88);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role { font-size: 11px; color: rgba(255,255,255,0.32); margin-top: 1px; }

    .logout-btn {
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.30);
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
      flex-shrink: 0;
    }
    .logout-btn:hover { background: rgba(220,38,38,0.2); color: #FCA5A5; }

    /* Main */
    .main-content {
      margin-left: 224px;
      flex: 1;
      padding: 32px 36px;
      min-height: 100vh;
    }
  `]
})
export class HomeComponent {
  constructor(private auth: AuthService) { }
  get userName() { return this.auth.getCurrentUser()?.name || 'Admin'; }
  get userInitial() { return this.userName.charAt(0).toUpperCase(); }
  logout() { this.auth.logout(); }
}
