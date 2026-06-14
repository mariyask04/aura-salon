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
      <h1>📋 Appointments</h1>
      <a routerLink="/appointments/new" class="btn btn-primary btn-sm">+ New Appointment</a>
    </div>

    <div class="card" style="margin-bottom:16px; padding:16px;">
      <div class="filters">
        <input class="form-control" style="max-width:200px;" type="date" [(ngModel)]="filterDate" (change)="load()" placeholder="Filter by date" />
        <select class="form-control" style="max-width:180px;" [(ngModel)]="filterStatus" (change)="applyFilter()">
          <option value="">All Statuses</option>
          <option value="booked">Booked</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button class="btn btn-secondary btn-sm" (click)="clearFilters()">Clear</button>
      </div>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
      <div *ngIf="loading" class="loading-state">Loading appointments...</div>
      <div *ngIf="!loading && filtered.length === 0" class="empty-state">
        <p>No appointments found.</p>
        <a routerLink="/appointments/new" class="btn btn-primary btn-sm mt-2">Book First Appointment</a>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let appt of filtered">
            <td>
              <strong>{{ appt.clientName }}</strong>
              <div class="text-muted">{{ appt.clientPhone }}</div>
            </td>
            <td>{{ appt.staffName }}</td>
            <td>{{ appt.service }}</td>
            <td>
              <strong>{{ appt.date }}</strong>
              <div class="text-muted">{{ appt.timeSlot }}</div>
            </td>
            <td>₹{{ appt.servicePrice }}</td>
            <td>
              <span class="badge" [class.badge-primary]="appt.status==='booked'"
                    [class.badge-success]="appt.status==='completed'"
                    [class.badge-danger]="appt.status==='cancelled'">
                {{ appt.status }}
              </span>
            </td>
            <td>
              <a [routerLink]="['/appointments', appt._id]" class="btn btn-secondary btn-sm">View</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .loading-state { padding: 40px; text-align: center; color: var(--text-muted); }
    .empty-state { padding: 60px; text-align: center; color: var(--text-muted); }
  `]
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filtered: Appointment[] = [];
  filterDate = '';
  filterStatus = '';
  loading = false;

  constructor(private api: ApiService) {}

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
    this.filtered = this.appointments.filter(a =>
      !this.filterStatus || a.status === this.filterStatus
    );
  }

  clearFilters() {
    this.filterDate = '';
    this.filterStatus = '';
    this.load();
  }
}