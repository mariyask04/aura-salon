import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Appointment } from '../../models/models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h1>Appointments</h1>
      <a routerLink="/appointments/new" class="btn btn-primary btn-sm">+ New Booking</a>
    </div>

    <div class="filter-bar card" style="padding: 14px 20px; margin-bottom: 16px;">
      <div class="filters">
        <div class="filter-group">
          <label>Date</label>
          <input class="form-control" style="width:160px" type="date" [(ngModel)]="filterDate" (change)="load()" />
        </div>
        <div class="filter-group">
          <label>Status</label>
          <select class="form-control" style="width:140px" [(ngModel)]="filterStatus" (change)="applyFilter()">
            <option value="">All</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button class="btn btn-ghost btn-sm" (click)="clearFilters()" style="align-self:flex-end; margin-bottom:0">Clear filters</button>
      </div>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
      <div *ngIf="loading" class="state-placeholder">
        <div class="loading-ring"></div> Loading…
      </div>
      <div *ngIf="!loading && filtered.length === 0" class="state-placeholder empty">
        <div class="empty-icon-lg">📋</div>
        <p>No appointments found</p>
        <a routerLink="/appointments/new" class="btn btn-primary btn-sm mt-2">Book first appointment</a>
      </div>
      <table *ngIf="!loading && filtered.length > 0">
        <thead>
          <tr>
            <th>Client</th>
            <th>Staff</th>
            <th>Service</th>
            <th>Date & Time</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let appt of filtered">
            <td>
              <div class="cell-primary">{{ appt.clientName }}</div>
              <div class="text-muted">{{ appt.clientPhone }}</div>
            </td>
            <td>{{ appt.staffName }}</td>
            <td>{{ appt.service }}</td>
            <td>
              <div class="cell-primary">{{ appt.date }}</div>
              <div class="text-muted">{{ appt.timeSlot }}</div>
            </td>
            <td class="price-cell">₹{{ appt.servicePrice }}</td>
            <td>
              <span class="badge"
                    [class.badge-primary]="appt.status==='booked'"
                    [class.badge-success]="appt.status==='completed'"
                    [class.badge-danger]="appt.status==='cancelled'">
                {{ appt.status }}
              </span>
            </td>
            <td>
              <a [routerLink]="['/appointments', appt._id]" class="btn btn-ghost btn-sm">View →</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .filter-bar { border-radius: var(--radius); }
    .filters { display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; }
    .filter-group { display: flex; flex-direction: column; gap: 5px; }
    .filter-group label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
    .state-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 80px 40px; color: var(--muted); font-size: 13.5px; }
    .state-placeholder.empty { }
    .empty-icon-lg { font-size: 36px; filter: grayscale(1); opacity: 0.35; }
    .loading-ring { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--plum); border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .cell-primary { font-weight: 600; color: var(--ink); font-size: 13.5px; }
    .price-cell { font-weight: 600; color: var(--plum); font-variant-numeric: tabular-nums; }
  `]
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filtered: Appointment[] = [];
  filterDate = '';
  filterStatus = '';
  loading = false;

  constructor(private api: ApiService) { }
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAppointments(this.filterDate || undefined).subscribe(a => {
      this.appointments = a;
      this.applyFilter();
      this.loading = false;
    });
  }

  applyFilter() {
    this.filtered = this.appointments.filter(a => !this.filterStatus || a.status === this.filterStatus);
  }

  clearFilters() { this.filterDate = ''; this.filterStatus = ''; this.load(); }
}
