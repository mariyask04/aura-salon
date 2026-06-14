import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Appointment, Staff, TIME_SLOTS } from '../../models/models';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-header">
      <h1>📅 Calendar</h1>
      <div class="d-flex gap-2 align-center flex-wrap">
        <button class="btn btn-secondary btn-sm" (click)="prevWeek()">← Prev</button>
        <span class="week-label">{{ weekLabel }}</span>
        <button class="btn btn-secondary btn-sm" (click)="nextWeek()">Next →</button>
        <button class="btn btn-primary btn-sm" (click)="goToToday()">Today</button>
      </div>
    </div>

    <div class="card" style="overflow-x:auto; padding: 0;">
      <div *ngIf="loading" class="loading-state">Loading...</div>
      <table *ngIf="!loading" class="calendar-table">
        <thead>
          <tr>
            <th class="time-col">Time</th>
            <th *ngFor="let day of weekDays" [class.today]="isToday(day.date)">
              <div class="day-header">
                <span class="day-name">{{ day.label }}</span>
                <span class="day-date" [class.today-badge]="isToday(day.date)">{{ day.dateStr }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let slot of timeSlots">
            <td class="time-cell">{{ slot }}</td>
            <td *ngFor="let day of weekDays"
                [class.past]="isPast(day.date, slot)"
                class="slot-cell"
                (click)="!isPast(day.date, slot) && onSlotClick(day.date, slot, null)">
              <ng-container *ngFor="let staff of staffList">
                <div *ngIf="getBooking(day.date, slot, staff._id) as booking; else emptySlot"
                     class="booking-chip"
                     [class.cancelled]="booking.status === 'cancelled'"
                     (click)="$event.stopPropagation(); onBookingClick(booking)">
                  <span class="booking-client">{{ booking.clientName }}</span>
                  <span class="booking-staff">{{ staff.name }}</span>
                  <span class="booking-service">{{ booking.service }}</span>
                </div>
                <ng-template #emptySlot>
                  <div *ngIf="!isPast(day.date, slot)"
                       class="empty-chip"
                       (click)="$event.stopPropagation(); onSlotClick(day.date, slot, staff)">
                    <span class="staff-name-mini">{{ staff.name.split(' ')[0] }}</span>
                    <span class="plus-icon">+</span>
                  </div>
                </ng-template>
              </ng-container>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Staff legend -->
    <div class="staff-legend card" style="margin-top: 16px; padding: 16px;">
      <strong style="font-size:13px; color: var(--text-muted);">STAFF</strong>
      <div class="legend-items">
        <div *ngFor="let s of staffList" class="legend-item">
          <div class="legend-dot"></div>
          <span>{{ s.name }} — {{ s.specialization }}</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .week-label { font-weight: 600; font-size: 14px; color: var(--text); min-width: 180px; text-align: center; }
    .calendar-table { width: 100%; border-collapse: collapse; min-width: 700px; }
    .calendar-table th, .calendar-table td { border: 1px solid var(--border); padding: 0; }
    .calendar-table th { background: #f9fafb; text-transform: none; font-size: 13px; padding: 10px 8px; }
    .time-col { width: 80px; }
    .day-header { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .day-name { font-weight: 700; font-size: 13px; color: var(--text); }
    .day-date { font-size: 12px; color: var(--text-muted); padding: 2px 6px; border-radius: 10px; }
    .today-badge { background: var(--primary); color: #fff; }
    .time-cell { padding: 8px 10px; font-size: 12px; color: var(--text-muted); background: #f9fafb; white-space: nowrap; }
    .slot-cell { padding: 4px; min-width: 120px; vertical-align: top; }
    .slot-cell:not(.past):hover { background: #faf5ff; cursor: pointer; }
    .past { background: #fafafa; opacity: 0.6; }
    .booking-chip {
      background: var(--primary-light);
      border: 1px solid var(--primary);
      border-radius: 6px;
      padding: 4px 6px;
      margin-bottom: 3px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .booking-chip:hover { background: var(--primary); color: #fff; }
    .booking-chip.cancelled { background: #fee2e2; border-color: var(--danger); opacity: 0.7; }
    .booking-client { display: block; font-size: 12px; font-weight: 600; color: var(--primary-dark); }
    .booking-chip:hover .booking-client, .booking-chip:hover .booking-staff, .booking-chip:hover .booking-service { color: #fff; }
    .booking-staff, .booking-service { display: block; font-size: 10px; color: var(--text-muted); }
    .empty-chip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 6px;
      border-radius: 6px;
      border: 1px dashed #d1d5db;
      margin-bottom: 3px;
      cursor: pointer;
      color: #9ca3af;
      font-size: 11px;
      transition: all 0.15s;
    }
    .empty-chip:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
    .plus-icon { font-size: 14px; font-weight: 700; }
    .staff-name-mini { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70px; }
    .loading-state { padding: 40px; text-align: center; color: var(--text-muted); }
    .legend-items { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 8px; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 13px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); }
  `]
})
export class CalendarComponent implements OnInit {
    timeSlots = TIME_SLOTS;
    weekDays: { date: string; label: string; dateStr: string }[] = [];
    staffList: Staff[] = [];
    appointments: Appointment[] = [];
    loading = false;
    currentWeekStart = new Date();

    constructor(private api: ApiService, private router: Router) {
        this.setWeekStart(new Date());
    }

    ngOnInit() {
        this.loadData();
    }

    setWeekStart(d: Date) {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        this.currentWeekStart = new Date(d.setDate(diff));
        this.buildWeek();
    }

    buildWeek() {
        this.weekDays = [];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 0; i < 7; i++) {
            const d = new Date(this.currentWeekStart);
            d.setDate(d.getDate() + i);
            this.weekDays.push({
                date: this.toDateStr(d),
                label: days[i],
                dateStr: `${d.getDate()}/${d.getMonth() + 1}`
            });
        }
    }

    toDateStr(d: Date) {
        return d.toISOString().split('T')[0];
    }

    get weekLabel() {
        const end = new Date(this.currentWeekStart);
        end.setDate(end.getDate() + 6);
        return `${this.currentWeekStart.getDate()} ${this.currentWeekStart.toLocaleString('default', { month: 'short' })} – ${end.getDate()} ${end.toLocaleString('default', { month: 'short', year: 'numeric' })}`;
    }

    prevWeek() {
        const d = new Date(this.currentWeekStart);
        d.setDate(d.getDate() - 7);
        this.currentWeekStart = d;
        this.buildWeek();
        this.loadAppointments();
    }

    nextWeek() {
        const d = new Date(this.currentWeekStart);
        d.setDate(d.getDate() + 7);
        this.currentWeekStart = d;
        this.buildWeek();
        this.loadAppointments();
    }

    goToToday() {
        this.setWeekStart(new Date());
        this.loadAppointments();
    }

    isToday(date: string) {
        return date === this.toDateStr(new Date());
    }

    isPast(date: string, slot: string): boolean {
        const now = new Date();
        const today = this.toDateStr(now);
        if (date < today) return true;
        if (date === today) {
            const slotHour = this.parseSlotHour(slot);
            return slotHour < now.getHours();
        }
        return false;
    }

    parseSlotHour(slot: string): number {
        const [time, period] = slot.split(' ');
        let [h] = time.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h;
    }

    loadData() {
        this.loading = true;
        this.api.getStaff().subscribe(staff => {
            this.staffList = staff;
            this.loadAppointments();
        });
    }

    loadAppointments() {
        this.loading = true;
        // Load all appointments for the week
        const startDate = this.weekDays[0]?.date;
        const endDate = this.weekDays[6]?.date;
        this.api.getAppointments().subscribe(appts => {
            this.appointments = appts.filter(a => a.date >= startDate && a.date <= endDate);
            this.loading = false;
        });
    }

    getBooking(date: string, slot: string, staffId: string): Appointment | undefined {
        return this.appointments.find(a =>
            a.date === date && a.timeSlot === slot && a.staffId === staffId && a.status !== 'cancelled'
        );
    }

    onSlotClick(date: string, slot: string, staff: Staff | null) {
        const params: any = { date, slot };
        if (staff) params.staffId = staff._id;
        this.router.navigate(['/appointments/new'], { queryParams: params });
    }

    onBookingClick(booking: Appointment) {
        this.router.navigate(['/appointments', booking._id]);
    }
}