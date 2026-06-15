import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Client } from '../../models/models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Clients</h1>
      <button class="btn btn-primary btn-sm" (click)="openAdd()">+ Add Client</button>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
      <div *ngIf="clients.length === 0" class="state-placeholder">
        <div class="empty-icon-lg">🧑‍🤝‍🧑</div>
        <p>No clients added yet</p>
        <button class="btn btn-primary btn-sm mt-2" (click)="openAdd()">Add first client</button>
      </div>
      <table *ngIf="clients.length > 0">
        <thead>
          <tr>
            <th>Client</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of clients">
            <td>
              <div class="client-cell">
                <div class="client-mini-avatar">{{ c.name.charAt(0) }}</div>
                <span class="cell-primary">{{ c.name }}</span>
              </div>
            </td>
            <td>{{ c.phone }}</td>
            <td>{{ c.email || '—' }}</td>
            <td class="notes-cell">{{ c.notes || '—' }}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-ghost btn-sm" (click)="openEdit(c)">Edit</button>
                <button class="btn btn-ghost btn-sm danger-ghost" (click)="onDelete(c._id)">Remove</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ editingId ? 'Edit' : 'Add' }} Client</h2>
          <button class="modal-close" (click)="showModal=false">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div class="form-row-2-modal">
          <div class="form-group"><label>Full Name</label><input class="form-control" [(ngModel)]="form.name" placeholder="Client name" /></div>
          <div class="form-group"><label>Phone</label><input class="form-control" [(ngModel)]="form.phone" placeholder="+91 00000 00000" /></div>
        </div>
        <div class="form-group"><label>Email</label><input class="form-control" [(ngModel)]="form.email" placeholder="email@example.com" /></div>
        <div class="form-group"><label>Notes</label><textarea class="form-control" [(ngModel)]="form.notes" rows="2" placeholder="Preferences, allergies, etc."></textarea></div>
        <div class="d-flex gap-2 justify-between mt-3">
          <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
          <button class="btn btn-primary" (click)="onSave()" [disabled]="!form.name || !form.phone">Save Client</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .state-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 80px 40px; color: var(--muted); }
    .empty-icon-lg { font-size: 36px; filter: grayscale(1); opacity: 0.35; }
    .client-cell { display: flex; align-items: center; gap: 10px; }
    .client-mini-avatar {
      width: 30px; height: 30px;
      background: linear-gradient(135deg, var(--plum), #6D28D9);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }
    .cell-primary { font-weight: 600; color: var(--ink); }
    .notes-cell { color: var(--muted); font-size: 12.5px; max-width: 200px; }
    .danger-ghost:hover { color: #DC2626 !important; background: #FEF2F2 !important; }
    .form-row-2-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  `]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  showModal = false;
  editingId = '';
  error = '';
  form: any = {};

  constructor(private api: ApiService) { }
  ngOnInit() { this.load(); }
  load() { this.api.getClients().subscribe(c => this.clients = c); }

  openAdd() { this.editingId = ''; this.form = {}; this.error = ''; this.showModal = true; }
  openEdit(c: Client) { this.editingId = c._id; this.form = { ...c }; this.error = ''; this.showModal = true; }

  onSave() {
    const obs = this.editingId ? this.api.updateClient(this.editingId, this.form) : this.api.createClient(this.form);
    obs.subscribe({ next: () => { this.showModal = false; this.load(); }, error: err => this.error = err.error?.message || 'Error' });
  }

  onDelete(id: string) {
    if (!confirm('Remove this client?')) return;
    this.api.deleteClient(id).subscribe(() => this.load());
  }
}
