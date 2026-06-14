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
      <h1>💰 Billing</h1>
    </div>

    <div class="summary-cards">
      <div class="card summary-card">
        <div class="summary-label">Total Bills</div>
        <div class="summary-value">{{ bills.length }}</div>
      </div>
      <div class="card summary-card">
        <div class="summary-label">Total Revenue</div>
        <div class="summary-value">₹{{ totalRevenue }}</div>
      </div>
    </div>

    <div class="card" style="padding:0; overflow:hidden; margin-top:20px;">
      <div *ngIf="loading" class="loading-state">Loading...</div>
      <div *ngIf="!loading && bills.length === 0" class="empty-state">
        <p>No bills generated yet. Book appointments and generate bills from the appointment detail page.</p>
      </div>
      <table *ngIf="!loading && bills.length > 0">
        <thead>
          <tr>
            <th>Client</th>
            <th>Staff</th>
            <th>Service</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Tax</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of bills">
            <td><strong>{{ b.clientName }}</strong></td>
            <td>{{ b.staffName }}</td>
            <td>{{ b.service }}</td>
            <td>{{ b.date }}<br><span class="text-muted">{{ b.timeSlot }}</span></td>
            <td>₹{{ b.serviceAmount }}</td>
            <td>{{ b.taxPercent }}%</td>
            <td>₹{{ b.discountAmount }}</td>
            <td><strong style="color: var(--primary);">₹{{ b.totalAmount }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .summary-card { text-align: center; }
    .summary-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
    .summary-value { font-size: 28px; font-weight: 800; color: var(--primary); margin-top: 6px; }
    .loading-state, .empty-state { padding: 60px; text-align: center; color: var(--text-muted); }
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

    get totalRevenue() {
        return this.bills.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2);
    }
}