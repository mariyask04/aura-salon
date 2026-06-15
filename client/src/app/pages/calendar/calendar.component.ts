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
      <h1>Calendar</h1>
      <div class="header-controls">
        <div class="week-nav">
          <button class="btn btn-secondary btn-sm" (click)="prevWeek()">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          </button>
          <span class="week-label">{{ weekLabel }}</span>
          <button class="btn btn-secondary btn-sm" (click)="nextWeek()">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <button class="btn btn-ghost btn-sm" (click)="goToToday()">Today</button>
        <button class="btn btn-primary btn-sm" (click)="goBook()">+ New Booking</button>
      </div>
    </div>

    <!-- Staff legend pills -->
    <div class="staff-pills" *ngIf="staffList.length">
      <div *ngFor="let s of staffList; let i = index" class="staff-pill">
        <span class="sp-dot" [style.background]="staffColors[i]"></span>
        {{ s.name }}
        <span class="sp-spec">{{ s.specialization }}</span>
      </div>
    </div>

    <div class="cal-card">
      <div *ngIf="loading" class="cal-loading">
        <div class="loading-ring"></div>
        <span>Loading schedule…</span>
      </div>

      <div class="cal-scroll" *ngIf="!loading">
        <table class="cal-table">
          <thead>
            <tr>
              <th class="time-th"></th>
              <th *ngFor="let day of weekDays" [class.is-today]="isToday(day.date)">
                <div class="day-th-inner">
                  <span class="dow">{{ day.label }}</span>
                  <span class="dom" [class.today-circle]="isToday(day.date)">{{ day.dom }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let slot of timeSlots; let si = index">
              <td class="time-td">
                <span *ngIf="si % 2 === 0">{{ slot }}</span>
              </td>
              <td *ngFor="let day of weekDays; let di = index"
                  class="slot-td"
                  [class.is-past]="isPast(day.date, slot)"
                  [class.is-today-col]="isToday(day.date)">
                <ng-container *ngFor="let staff of staffList; let si2 = index">
                  <ng-container *ngIf="getBooking(day.date, slot, staff._id) as booking">
                    <div class="booking-tag"
                         [style.border-left-color]="staffColors[si2]"
                         [class.is-cancelled]="booking.status === 'cancelled'"
                         [class.is-complete]="booking.status === 'completed'"
                         (click)="onBookingClick(booking)">
                      <span class="bt-client">{{ booking.clientName }}</span>
                      <span class="bt-detail">{{ booking.service }}</span>
                    </div>
                  </ng-container>
                  <ng-container *ngIf="!getBooking(day.date, slot, staff._id) && !isPast(day.date, slot)">
                    <div class="empty-tag" (click)="onSlotClick(day.date, slot, staff)">
                      <span class="et-name">{{ staff.name.split(' ')[0] }}</span>
                      <svg class="et-plus" viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
                        <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z"/>
                      </svg>
                    </div>
                  </ng-container>
                </ng-container>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .header-controls { display: flex; align-items: center; gap: 8px; }
    .week-nav { display: flex; align-items: center; gap: 4px; }
    .week-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--ink);
      min-width: 190px;
      text-align: center;
      padding: 0 4px;
    }

    .staff-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .staff-pill {
      display: flex;
      align-items: center;
      gap: 7px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 12.5px;
      color: var(--ink-soft);
    }
    .sp-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .sp-spec { color: var(--muted); font-size: 11.5px; }

    .cal-card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-soft);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }
    .cal-scroll { overflow-x: auto; }
    .cal-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 80px 40px;
      color: var(--muted);
      font-size: 13px;
    }
    .loading-ring {
      width: 20px; height: 20px;
      border: 2px solid var(--border);
      border-top-color: var(--plum);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .cal-table { width: 100%; border-collapse: collapse; min-width: 760px; }

    /* Header row */
    .cal-table thead th {
      padding: 0;
      background: var(--canvas);
      border-bottom: 1px solid var(--border);
      border-right: 1px solid var(--border-soft);
      text-transform: none;
      letter-spacing: 0;
    }
    .cal-table thead th:last-child { border-right: none; }

    .time-th { width: 68px; min-width: 68px; }
    .day-th-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 14px 8px 12px;
      gap: 4px;
    }
    .dow { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
    .dom {
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 600;
      color: var(--ink);
    }
    .today-circle { background: var(--plum); color: #fff; }
    .is-today { background: #FDFCFF; }

    /* Body */
    .time-td {
      padding: 0 10px;
      font-size: 11px;
      color: var(--muted);
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      vertical-align: top;
      padding-top: 6px;
      border-right: 1px solid var(--border-soft);
      background: var(--canvas);
    }
    .slot-td {
      padding: 3px 4px;
      vertical-align: top;
      border-bottom: 1px solid var(--border-soft);
      border-right: 1px solid var(--border-soft);
      min-height: 36px;
      min-width: 120px;
    }
    .slot-td:last-child { border-right: none; }
    .is-today-col { background: #FEFCFF; }
    .is-past { background: #FAFAF8; opacity: 0.65; }

    /* Booking tag */
    .booking-tag {
      border-left: 3px solid var(--plum);
      background: var(--plum-light);
      border-radius: 0 5px 5px 0;
      padding: 4px 7px;
      margin-bottom: 2px;
      cursor: pointer;
      transition: filter 0.15s, transform 0.1s;
    }
    .booking-tag:hover { filter: brightness(0.96); transform: translateX(1px); }
    .booking-tag.is-cancelled { opacity: 0.45; background: var(--border-soft); border-left-color: var(--muted); }
    .booking-tag.is-complete { background: var(--emerald-bg); border-left-color: #059669; }
    .bt-client { display: block; font-size: 11.5px; font-weight: 600; color: var(--plum); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .booking-tag.is-complete .bt-client { color: var(--emerald); }
    .bt-detail { display: block; font-size: 10.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Empty slot */
    .empty-tag {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 7px;
      border-radius: 5px;
      border: 1px dashed var(--border);
      margin-bottom: 2px;
      cursor: pointer;
      color: var(--muted);
      font-size: 11px;
      transition: border-color 0.15s, background 0.15s, color 0.15s;
    }
    .empty-tag:hover {
      border-color: var(--plum);
      background: var(--plum-light);
      color: var(--plum);
    }
    .et-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70px; }
    .et-plus { flex-shrink: 0; }
  `]
})
export class CalendarComponent implements OnInit {
  timeSlots = TIME_SLOTS;
  weekDays: { date: string; label: string; dom: string }[] = [];
  staffList: Staff[] = [];
  appointments: Appointment[] = [];
  loading = false;
  currentWeekStart = new Date();

  staffColors = ['#4A1D96', '#0F766E', '#B45309', '#BE185D', '#1D4ED8', '#7C3AED', '#065F46'];

  constructor(private api: ApiService, private router: Router) {
    this.setWeekStart(new Date());
  }

  ngOnInit() { this.loadData(); }

  setWeekStart(d: Date) {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    this.currentWeekStart = new Date(new Date(d).setDate(diff));
    this.buildWeek();
  }

  buildWeek() {
    this.weekDays = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.currentWeekStart);
      d.setDate(d.getDate() + i);
      this.weekDays.push({ date: this.toDateStr(d), label: days[i], dom: String(d.getDate()) });
    }
  }

  toDateStr(d: Date) { return d.toISOString().split('T')[0]; }

  get weekLabel() {
    const end = new Date(this.currentWeekStart);
    end.setDate(end.getDate() + 6);
    const fmt = (d: Date) => `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
    return `${fmt(this.currentWeekStart)} – ${fmt(end)}, ${end.getFullYear()}`;
  }

  prevWeek() { const d = new Date(this.currentWeekStart); d.setDate(d.getDate() - 7); this.currentWeekStart = d; this.buildWeek(); this.loadAppointments(); }
  nextWeek() { const d = new Date(this.currentWeekStart); d.setDate(d.getDate() + 7); this.currentWeekStart = d; this.buildWeek(); this.loadAppointments(); }
  goToToday() { this.setWeekStart(new Date()); this.loadAppointments(); }
  isToday(date: string) { return date === this.toDateStr(new Date()); }

  isPast(date: string, slot: string): boolean {
    const today = this.toDateStr(new Date());
    if (date < today) return true;
    if (date === today) {
      const now = new Date();
      const [time, period] = slot.split(' ');
      let [h] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h < now.getHours();
    }
    return false;
  }

  loadData() {
    this.loading = true;
    this.api.getStaff().subscribe(staff => { this.staffList = staff; this.loadAppointments(); });
  }

  loadAppointments() {
    this.loading = true;
    const start = this.weekDays[0]?.date, end = this.weekDays[6]?.date;
    this.api.getAppointments().subscribe(appts => {
      this.appointments = appts.filter(a => a.date >= start && a.date <= end);
      this.loading = false;
    });
  }

  getBooking(date: string, slot: string, staffId: string): Appointment | undefined {
    return this.appointments.find(a => a.date === date && a.timeSlot === slot && a.staffId === staffId && a.status !== 'cancelled');
  }

  onSlotClick(date: string, slot: string, staff: Staff) {
    this.router.navigate(['/appointments/new'], { queryParams: { date, slot, staffId: staff._id } });
  }
  onBookingClick(booking: Appointment) { this.router.navigate(['/appointments', booking._id]); }
  goBook() { this.router.navigate(['/appointments/new']); }
}
