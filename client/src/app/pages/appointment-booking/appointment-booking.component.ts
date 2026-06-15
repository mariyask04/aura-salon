import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Staff, SERVICES, TIME_SLOTS } from '../../models/models';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1>New Booking</h1>
        <p class="page-sub">Fill in the details to schedule an appointment</p>
      </div>
      <a routerLink="/calendar" class="btn btn-secondary btn-sm">← Back to Calendar</a>
    </div>

    <div class="booking-grid">
      <!-- Form -->
      <div class="card booking-card">
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">Appointment booked — redirecting…</div>

        <div class="form-section">
          <div class="form-section-title">Client Details</div>
          <div class="form-row-2">
            <div class="form-group">
              <label>Client Name</label>
              <input class="form-control" [(ngModel)]="form.clientName" placeholder="Full name" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input class="form-control" [(ngModel)]="form.clientPhone" placeholder="+91 00000 00000" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-title">Appointment</div>
          <div class="form-row-2">
            <div class="form-group">
              <label>Staff Member</label>
              <select class="form-control" [(ngModel)]="form.staffId" (change)="onStaffChange()">
                <option value="">Select staff…</option>
                <option *ngFor="let s of staffList" [value]="s._id">{{ s.name }} — {{ s.specialization }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Service</label>
              <select class="form-control" [(ngModel)]="form.service" (change)="onServiceChange()">
                <option value="">Select service…</option>
                <option *ngFor="let s of services" [value]="s.name">{{ s.name }} — ₹{{ s.price }}</option>
              </select>
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label>Date</label>
              <input class="form-control" type="date" [(ngModel)]="form.date" [min]="today" (change)="loadExisting()" />
            </div>
            <div class="form-group">
              <label>Time Slot</label>
              <select class="form-control" [(ngModel)]="form.timeSlot">
                <option value="">Select time…</option>
                <option *ngFor="let t of timeSlots" [value]="t" [disabled]="isSlotBooked(t)">
                  {{ t }}{{ isSlotBooked(t) ? ' — Booked' : '' }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-title">Additional</div>
          <div class="form-row-2">
            <div class="form-group">
              <label>Price (₹)</label>
              <input class="form-control" type="number" [(ngModel)]="form.servicePrice" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Notes</label>
              <input class="form-control" [(ngModel)]="form.notes" placeholder="Special requests…" />
            </div>
          </div>
        </div>

        <div class="form-footer">
          <a routerLink="/calendar" class="btn btn-secondary">Discard</a>
          <button class="btn btn-primary" (click)="onBook()" [disabled]="loading || !isFormValid()">
            <span *ngIf="!loading">Confirm Booking</span>
            <span *ngIf="loading" class="btn-spinner"></span>
          </button>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary-panel">
        <div class="card summary-card">
          <div class="summary-header">Booking Summary</div>
          <div class="summary-empty" *ngIf="!hasAnySummary()">
            <div class="empty-icon">📋</div>
            <p>Fill in the form to see a preview</p>
          </div>
          <div *ngIf="hasAnySummary()">
            <div class="summary-row" *ngIf="form.clientName">
              <span class="sr-label">Client</span>
              <span class="sr-val">{{ form.clientName }}</span>
            </div>
            <div class="summary-row" *ngIf="form.clientPhone">
              <span class="sr-label">Phone</span>
              <span class="sr-val">{{ form.clientPhone }}</span>
            </div>
            <div class="summary-row" *ngIf="selectedStaffName">
              <span class="sr-label">Staff</span>
              <span class="sr-val">{{ selectedStaffName }}</span>
            </div>
            <div class="summary-row" *ngIf="form.service">
              <span class="sr-label">Service</span>
              <span class="sr-val">{{ form.service }}</span>
            </div>
            <div class="summary-row" *ngIf="form.date">
              <span class="sr-label">Date</span>
              <span class="sr-val">{{ form.date }}</span>
            </div>
            <div class="summary-row" *ngIf="form.timeSlot">
              <span class="sr-label">Time</span>
              <span class="sr-val">{{ form.timeSlot }}</span>
            </div>
            <div class="summary-divider" *ngIf="form.servicePrice"></div>
            <div class="summary-price" *ngIf="form.servicePrice">
              <span>Amount</span>
              <span>₹{{ form.servicePrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-sub { font-size: 13px; color: var(--muted); margin-top: 2px; }

    .booking-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }
    .booking-card { padding: 0; overflow: hidden; }

    .form-section { padding: 24px 28px; border-bottom: 1px solid var(--border-soft); }
    .form-section:last-of-type { border-bottom: none; }
    .form-section-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 18px;
    }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 0; }

    .form-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 20px 28px;
      background: var(--canvas);
      border-top: 1px solid var(--border-soft);
    }

    /* Summary */
    .summary-card { padding: 22px; }
    .summary-header {
      font-size: 13px;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-soft);
    }
    .summary-empty { text-align: center; padding: 24px 0; color: var(--muted); }
    .empty-icon { font-size: 32px; margin-bottom: 8px; filter: grayscale(1); opacity: 0.4; }
    .summary-empty p { font-size: 12.5px; }
    .summary-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid var(--border-soft); gap: 12px; }
    .sr-label { font-size: 11.5px; color: var(--muted); font-weight: 500; flex-shrink: 0; }
    .sr-val { font-size: 12.5px; color: var(--ink); font-weight: 500; text-align: right; }
    .summary-divider { border-top: 2px solid var(--border); margin: 12px 0 8px; }
    .summary-price { display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; color: var(--plum); }

    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 860px) {
      .booking-grid { grid-template-columns: 1fr; }
      .form-row-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class AppointmentBookingComponent implements OnInit {
  staffList: Staff[] = [];
  services = SERVICES;
  timeSlots = TIME_SLOTS;
  existingAppointments: any[] = [];
  today = new Date().toISOString().split('T')[0];
  loading = false;
  error = '';
  success = false;

  form = { clientName:'', clientPhone:'', staffId:'', date:'', timeSlot:'', service:'', servicePrice:0, notes:'' };

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.api.getStaff().subscribe(s => this.staffList = s);
    this.route.queryParams.subscribe(p => {
      if (p['date']) this.form.date = p['date'];
      if (p['slot']) this.form.timeSlot = p['slot'];
      if (p['staffId']) this.form.staffId = p['staffId'];
      if (this.form.date && this.form.staffId) this.loadExisting();
    });
  }

  loadExisting() {
    if (this.form.date && this.form.staffId)
      this.api.getAppointments(this.form.date, this.form.staffId).subscribe(a => {
        this.existingAppointments = a.filter((x: any) => x.status !== 'cancelled');
      });
  }

  onStaffChange() { this.loadExisting(); }
  onServiceChange() { const s = this.services.find(x => x.name === this.form.service); if (s) this.form.servicePrice = s.price; }
  isSlotBooked(slot: string) { return this.existingAppointments.some(a => a.timeSlot === slot); }
  get selectedStaffName() { return this.staffList.find(s => s._id === this.form.staffId)?.name || ''; }
  hasAnySummary() { return this.form.clientName || this.form.service || this.form.date; }
  isFormValid() { return this.form.clientName && this.form.clientPhone && this.form.staffId && this.form.date && this.form.timeSlot && this.form.service; }

  onBook() {
    this.error = ''; this.loading = true;
    this.api.createAppointment({ ...this.form, staffName: this.selectedStaffName }).subscribe({
      next: (appt) => { this.success = true; this.loading = false; setTimeout(() => this.router.navigate(['/appointments', appt._id]), 1000); },
      error: (err) => { this.error = err.error?.message || 'Booking failed'; this.loading = false; }
    });
  }
}
