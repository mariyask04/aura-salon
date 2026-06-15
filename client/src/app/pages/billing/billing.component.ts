import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Bill } from '../../models/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1>Billing</h1>
    </div>

    <div class="stats-row">
      <div class="card stat-card">
        <div class="stat-label">Total Bills</div>
        <div class="stat-value">{{ bills.length }}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value">₹{{ totalRevenue }}</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Avg. Bill</div>
        <div class="stat-value">₹{{ avgBill }}</div>
      </div>
    </div>

    <div class="card" style="padding:0; overflow:hidden; margin-top: 20px;">
      <div *ngIf="loading" class="state-placeholder">
        <div class="loading-ring"></div> Loading bills…
      </div>
      <div *ngIf="!loading && bills.length === 0" class="state-placeholder">
        <div class="empty-icon-lg">💰</div>
        <p>No bills generated yet.<br>Generate bills from the appointment detail page.</p>
      </div>
      <table *ngIf="!loading && bills.length > 0">
        <thead>
          <tr>
            <th>Client</th>
            <th>Staff</th>
            <th>Service</th>
            <th>Date</th>
            <th>Subtotal</th>
            <th>Tax</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of bills">
            <td><span class="cell-primary">{{ b.clientName }}</span></td>
            <td>{{ b.staffName }}</td>
            <td>{{ b.service }}</td>
            <td>
              <span class="cell-primary">{{ b.date }}</span>
              <div class="text-muted">{{ b.timeSlot }}</div>
            </td>
            <td class="num-cell">₹{{ b.serviceAmount }}</td>
            <td class="num-cell">{{ b.taxPercent }}%</td>
            <td class="num-cell discount-cell">{{ b.discountAmount ? '−₹' + b.discountAmount : '—' }}</td>
            <td class="num-cell total-cell">₹{{ b.totalAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .stat-card { text-align: center; padding: 24px; }
    .stat-label { font-size: 11.5px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
    .stat-value { font-family: 'DM Serif Display', serif; font-size: 32px; font-weight: 400; color: var(--plum); letter-spacing: -0.02em; }
    .state-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 80px 40px; color: var(--muted); text-align: center; line-height: 1.6; }
    .empty-icon-lg { font-size: 36px; filter: grayscale(1); opacity: 0.35; }
    .loading-ring { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--plum); border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .cell-primary { font-weight: 600; color: var(--ink); }
    .num-cell { font-variant-numeric: tabular-nums; font-size: 13.5px; }
    .discount-cell { color: #B91C1C; }
    .total-cell { font-weight: 700; color: var(--plum); font-size: 14px; }
  `]
})
export class BillingComponent implements OnInit {
  bills: Bill[] = [];
  loading = false;

  constructor(private api: ApiService) { }
  ngOnInit() {
    this.loading = true;
    this.api.getBills().subscribe(b => { this.bills = b; this.loading = false; });
  }

  get totalRevenue() { return this.bills.reduce((s, b) => s + b.totalAmount, 0).toFixed(2); }
  get avgBill() { return this.bills.length ? (this.bills.reduce((s, b) => s + b.totalAmount, 0) / this.bills.length).toFixed(0) : '0'; }
}
