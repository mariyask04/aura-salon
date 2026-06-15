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
      <h1>Staff</h1>
      <button class="btn btn-primary btn-sm" (click)="openAdd()">+ Add Staff</button>
    </div>

    <div class="staff-grid">
      <div *ngFor="let s of staffList" class="card staff-card">
        <div class="sc-avatar">{{ s.name.charAt(0) }}</div>
        <div class="sc-body">
          <div class="sc-name">{{ s.name }}</div>
          <div class="sc-spec">{{ s.specialization }}</div>
          <div class="sc-contact">
            <span *ngIf="s.phone">📞 {{ s.phone }}</span>
            <span *ngIf="s.email">✉ {{ s.email }}</span>
          </div>
        </div>
        <div class="sc-actions">
          <button class="btn btn-ghost btn-sm" (click)="openEdit(s)">Edit</button>
          <button class="btn btn-ghost btn-sm danger-ghost" (click)="onDelete(s._id)">Remove</button>
        </div>
      </div>

      <div *ngIf="staffList.length === 0" class="empty-state card">
        <p>No staff added yet.</p>
        <button class="btn btn-primary btn-sm mt-2" (click)="openAdd()">Add first staff member</button>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ editingId ? 'Edit' : 'Add' }} Staff</h2>
          <button class="modal-close" (click)="showModal=false">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div class="form-row-2-modal">
          <div class="form-group"><label>Full Name</label><input class="form-control" [(ngModel)]="form.name" placeholder="e.g. Priya Sharma" /></div>
          <div class="form-group"><label>Specialization</label><input class="form-control" [(ngModel)]="form.specialization" placeholder="e.g. Hair Stylist" /></div>
        </div>
        <div class="form-row-2-modal">
          <div class="form-group"><label>Phone</label><input class="form-control" [(ngModel)]="form.phone" placeholder="+91 00000 00000" /></div>
          <div class="form-group"><label>Email</label><input class="form-control" [(ngModel)]="form.email" placeholder="name@example.com" /></div>
        </div>
        <div class="d-flex gap-2 justify-between mt-3">
          <button class="btn btn-secondary" (click)="showModal=false">Cancel</button>
          <button class="btn btn-primary" (click)="onSave()" [disabled]="!form.name">Save Staff</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .staff-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .staff-card { display: flex; align-items: flex-start; gap: 14px; padding: 20px; }
    .sc-avatar {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, var(--plum), #6D28D9);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }
    .sc-body { flex: 1; min-width: 0; }
    .sc-name { font-size: 14.5px; font-weight: 700; color: var(--ink); }
    .sc-spec { font-size: 12.5px; color: var(--plum); font-weight: 500; margin-top: 2px; }
    .sc-contact { font-size: 12px; color: var(--muted); margin-top: 6px; display: flex; flex-direction: column; gap: 2px; }
    .sc-actions { display: flex; flex-direction: column; gap: 4px; }
    .danger-ghost:hover { color: #DC2626 !important; background: #FEF2F2 !important; }
    .empty-state { text-align: center; padding: 60px 40px; color: var(--muted); grid-column: 1/-1; }
    .form-row-2-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  `]
})
export class StaffComponent implements OnInit {
  staffList: Staff[] = [];
  showModal = false;
  editingId = '';
  error = '';
  form: any = {};

  constructor(private api: ApiService) { }
  ngOnInit() { this.load(); }

  load() { this.api.getStaff().subscribe(s => this.staffList = s); }

  openAdd() { this.editingId = ''; this.form = {}; this.error = ''; this.showModal = true; }
  openEdit(s: Staff) { this.editingId = s._id; this.form = { ...s }; this.error = ''; this.showModal = true; }

  onSave() {
    const obs = this.editingId ? this.api.updateStaff(this.editingId, this.form) : this.api.createStaff(this.form);
    obs.subscribe({ next: () => { this.showModal = false; this.load(); }, error: err => this.error = err.error?.message || 'Error' });
  }

  onDelete(id: string) {
    if (!confirm('Remove this staff member?')) return;
    this.api.deleteStaff(id).subscribe(() => this.load());
  }
}
