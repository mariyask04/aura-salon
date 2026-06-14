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
      <h1>🧑‍🤝‍🧑 Clients</h1>
      <button class="btn btn-primary btn-sm" (click)="openAdd()">+ Add Client</button>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of clients">
            <td><strong>{{ c.name }}</strong></td>
            <td>{{ c.phone }}</td>
            <td>{{ c.email || '—' }}</td>
            <td>{{ c.notes || '—' }}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-secondary btn-sm" (click)="openEdit(c)">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="onDelete(c._id)">Remove</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="clients.length === 0">
            <td colspan="5" style="text-align:center; color: var(--text-muted); padding: 40px;">No clients yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-overlay" *ngIf="showModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingId ? 'Edit' : 'Add' }} Client</h2>
          <button class="modal-close" (click)="showModal = false">×</button>
        </div>
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div class="form-group">
          <label>Name *</label>
          <input class="form-control" [(ngModel)]="form.name" />
        </div>
        <div class="form-group">
          <label>Phone *</label>
          <input class="form-control" [(ngModel)]="form.phone" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input class="form-control" [(ngModel)]="form.email" />
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea class="form-control" [(ngModel)]="form.notes" rows="2"></textarea>
        </div>
        <div class="d-flex gap-2 justify-between mt-3">
          <button class="btn btn-secondary" (click)="showModal = false">Cancel</button>
          <button class="btn btn-primary" (click)="onSave()" [disabled]="!form.name || !form.phone">Save</button>
        </div>
      </div>
    </div>
  `
})
export class ClientsComponent implements OnInit {
    clients: Client[] = [];
    showModal = false;
    editingId = '';
    error = '';
    form: any = {};

    constructor(private api: ApiService) { }
    ngOnInit() { this.load(); }

    load() {
        this.api.getClients().subscribe(c => this.clients = c);
    }

    openAdd() {
        this.editingId = '';
        this.form = {};
        this.error = '';
        this.showModal = true;
    }

    openEdit(c: Client) {
        this.editingId = c._id;
        this.form = { ...c };
        this.error = '';
        this.showModal = true;
    }

    onSave() {
        const obs = this.editingId
            ? this.api.updateClient(this.editingId, this.form)
            : this.api.createClient(this.form);
        obs.subscribe({
            next: () => { this.showModal = false; this.load(); },
            error: err => this.error = err.error?.message || 'Error saving'
        });
    }

    onDelete(id: string) {
        if (!confirm('Remove this client?')) return;
        this.api.deleteClient(id).subscribe(() => this.load());
    }
}