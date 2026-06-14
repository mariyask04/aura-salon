import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Staff } from '../../models/models';

@Component({
    selector: 'app-staff',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-header">
      <h1>👥 Staff</h1>
      <button class="btn btn-primary btn-sm" (click)="openAdd()">+ Add Staff</button>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of staffList">
            <td><strong>{{ s.name }}</strong></td>
            <td>{{ s.specialization }}</td>
            <td>{{ s.phone }}</td>
            <td>{{ s.email || '—' }}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-secondary btn-sm" (click)="openEdit(s)">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="onDelete(s._id)">Remove</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-overlay" *ngIf="showModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingId ? 'Edit' : 'Add' }} Staff</h2>
          <button class="modal-close" (click)="showModal = false">×</button>
        </div>
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div class="form-group">
          <label>Name *</label>
          <input class="form-control" [(ngModel)]="form.name" />
        </div>
        <div class="form-group">
          <label>Specialization</label>
          <input class="form-control" [(ngModel)]="form.specialization" />
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input class="form-control" [(ngModel)]="form.phone" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input class="form-control" [(ngModel)]="form.email" />
        </div>
        <div class="d-flex gap-2 justify-between mt-3">
          <button class="btn btn-secondary" (click)="showModal = false">Cancel</button>
          <button class="btn btn-primary" (click)="onSave()" [disabled]="!form.name">Save</button>
        </div>
      </div>
    </div>
  `
})
export class StaffComponent implements OnInit {
    staffList: Staff[] = [];
    showModal = false;
    editingId = '';
    error = '';
    form: any = {};

    constructor(private api: ApiService) { }
    ngOnInit() { this.load(); }

    load() {
        this.api.getStaff().subscribe(s => this.staffList = s);
    }

    openAdd() {
        this.editingId = '';
        this.form = {};
        this.error = '';
        this.showModal = true;
    }

    openEdit(s: Staff) {
        this.editingId = s._id;
        this.form = { ...s };
        this.error = '';
        this.showModal = true;
    }

    onSave() {
        const obs = this.editingId
            ? this.api.updateStaff(this.editingId, this.form)
            : this.api.createStaff(this.form);
        obs.subscribe({
            next: () => { this.showModal = false; this.load(); },
            error: err => this.error = err.error?.message || 'Error saving'
        });
    }

    onDelete(id: string) {
        if (!confirm('Remove this staff member?')) return;
        this.api.deleteStaff(id).subscribe(() => this.load());
    }
}