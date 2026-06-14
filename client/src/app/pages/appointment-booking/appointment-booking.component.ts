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
      <h1>📋 Book Appointment</h1>
      <a routerLink="/calendar" class="btn btn-secondary btn-sm">← Back to Calendar</a>
    </div>

    <div class="booking-layout">
      <div class="card booking-form">
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">✅ Appointment booked successfully!</div>

        <div class="form-row">
          <div class="form-group">
            <label>Client Name *</label>
            <input class="form-control" [(ngModel)]="form.clientName" placeholder="Enter client name" required />
          </div>
          <div class="form-group">
            <label>Client Phone *</label>
            <input class="form-control" [(ngModel)]="form.clientPhone" placeholder="Enter phone number" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Staff *</label>
            <select class="form-control" [(ngModel)]="form.staffId" (change)="onStaffChange()">
              <option value="">Select staff</option>
              <option *ngFor="let s of staffList" [value]="s._id">{{ s.name }} — {{ s.specialization }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Service *</label>
            <select class="form-control" [(ngModel)]="form.service" (change)="onServiceChange()">
              <option value="">Select service</option>
              <option *ngFor="let s of services" [value]="s.name">{{ s.name }} — ₹{{ s.price }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Date *</label>
            <input class="form-control" type="date" [(ngModel)]="form.date" [min]="today" />
          </div>
          <div class="form-group">
            <label>Time Slot *</label>
            <select class="form-control" [(ngModel)]="form.timeSlot">
              <option value="">Select time</option>
              <option *ngFor="let t of timeSlots" [value]="t"
                      [disabled]="isSlotBooked(t)">
                {{ t }} {{ isSlotBooked(t) ? '(Booked)' : '' }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Service Price (₹)</label>
            <input class="form-control" type="number" [(ngModel)]="form.servicePrice" placeholder="0" />
          </div>
          <div class="form-group">
            <label>Notes / Instructions</label>
            <input class="form-control" [(ngModel)]="form.notes" placeholder="Any special instructions..." />
          </div>
        </div>

        <div class="form-actions">
          <a routerLink="/calendar" class="btn btn-secondary">Cancel</a>
          <button class="btn btn-primary" (click)="onBook()" [disabled]="loading || !isFormValid()">
            {{ loading ? 'Booking...' : '✅ Book Appointment' }}
          </button>
        </div>
      </div>

      <div class="booking-summary card">
        <h3>📝 Booking Summary</h3>
        <div class="summary-item" *ngIf="form.clientName">
          <span class="summary-label">Client</span>
          <span>{{ form.clientName }}</span>
        </div>
        <div class="summary-item" *ngIf="form.clientPhone">
          <span class="summary-label">Phone</span>
          <span>{{ form.clientPhone }}</span>
        </div>
        <div class="summary-item" *ngIf="selectedStaffName">
          <span class="summary-label">Staff</span>
          <span>{{ selectedStaffName }}</span>
        </div>
        <div class="summary-item" *ngIf="form.service">
          <span class="summary-label">Service</span>
          <span>{{ form.service }}</span>
        </div>
        <div class="summary-item" *ngIf="form.date">
          <span class="summary-label">Date</span>
          <span>{{ form.date }}</span>
        </div>
        <div class="summary-item" *ngIf="form.timeSlot">
          <span class="summary-label">Time</span>
          <span>{{ form.timeSlot }}</span>
        </div>
        <div class="summary-divider" *ngIf="form.servicePrice"></div>
        <div class="summary-total" *ngIf="form.servicePrice">
          <span>Price</span>
          <span>₹{{ form.servicePrice }}</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .booking-layout { display: grid; grid-template-columns: 1fr 280px; gap: 20px; }
    .booking-form { }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
    h3 { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: var(--text); }
    .summary-item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid var(--border); }
    .summary-label { color: var(--text-muted); font-weight: 500; }
    .summary-divider { border-top: 2px solid var(--border); margin: 8px 0; }
    .summary-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: var(--primary); padding: 8px 0; }
    @media (max-width: 768px) {
      .booking-layout { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
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

    form = {
        clientName: '',
        clientPhone: '',
        staffId: '',
        date: '',
        timeSlot: '',
        service: '',
        servicePrice: 0,
        notes: '',
    };

    constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

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
        if (this.form.date && this.form.staffId) {
            this.api.getAppointments(this.form.date, this.form.staffId).subscribe(a => {
                this.existingAppointments = a.filter(x => x.status !== 'cancelled');
            });
        }
    }

    onStaffChange() {
        this.loadExisting();
    }

    onServiceChange() {
        const svc = this.services.find(s => s.name === this.form.service);
        if (svc) this.form.servicePrice = svc.price;
    }

    isSlotBooked(slot: string): boolean {
        return this.existingAppointments.some(a => a.timeSlot === slot);
    }

    get selectedStaffName() {
        return this.staffList.find(s => s._id === this.form.staffId)?.name || '';
    }

    isFormValid() {
        return this.form.clientName && this.form.clientPhone && this.form.staffId &&
            this.form.date && this.form.timeSlot && this.form.service;
    }

    onBook() {
        this.error = '';
        this.loading = true;
        const payload = {
            ...this.form,
            staffName: this.selectedStaffName,
        };
        this.api.createAppointment(payload).subscribe({
            next: (appt) => {
                this.success = true;
                this.loading = false;
                setTimeout(() => this.router.navigate(['/appointments', appt._id]), 1200);
            },
            error: (err) => {
                this.error = err.error?.message || 'Booking failed';
                this.loading = false;
            }
        });
    }
}