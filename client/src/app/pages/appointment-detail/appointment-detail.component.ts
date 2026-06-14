import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Appointment, Bill, Staff, SERVICES, TIME_SLOTS } from '../../models/models';

@Component({
    selector: 'app-appointment-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div *ngIf="!appointment" class="loading-state">Loading...</div>

    <ng-container *ngIf="appointment">
      <div class="page-header">
        <h1>📋 Appointment Details</h1>
        <div class="d-flex gap-2">
          <a routerLink="/appointments" class="btn btn-secondary btn-sm">← Back</a>
        </div>
      </div>

      <div class="detail-layout">
        <!-- Main info -->
        <div class="card">
          <div class="detail-header">
            <div>
              <h2>{{ appointment.clientName }}</h2>
              <p class="text-muted">{{ appointment.clientPhone }}</p>
            </div>
            <span class="badge" [class.badge-primary]="appointment.status==='booked'"
                  [class.badge-success]="appointment.status==='completed'"
                  [class.badge-danger]="appointment.status==='cancelled'">
              {{ appointment.status }}
            </span>
          </div>

          <div class="detail-grid">
            <div class="detail-field">
              <span class="field-label">Staff</span>
              <span>{{ appointment.staffName }}</span>
            </div>
            <div class="detail-field">
              <span class="field-label">Service</span>
              <span>{{ appointment.service }}</span>
            </div>
            <div class="detail-field">
              <span class="field-label">Date</span>
              <span>{{ appointment.date }}</span>
            </div>
            <div class="detail-field">
              <span class="field-label">Time</span>
              <span>{{ appointment.timeSlot }}</span>
            </div>
            <div class="detail-field">
              <span class="field-label">Price</span>
              <span class="price">₹{{ appointment.servicePrice }}</span>
            </div>
            <div class="detail-field" *ngIf="appointment.notes">
              <span class="field-label">Notes</span>
              <span>{{ appointment.notes }}</span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="action-buttons" *ngIf="appointment.status === 'booked'">
            <button class="btn btn-secondary btn-sm" (click)="showEdit = true">✏️ Edit</button>
            <button class="btn btn-warning btn-sm" (click)="showReschedule = true">🔄 Reschedule</button>
            <button class="btn btn-danger btn-sm" (click)="onCancel()">❌ Cancel</button>
            <button class="btn btn-success btn-sm" (click)="onMarkComplete()">✅ Complete</button>
          </div>

          <!-- Share section -->
          <div class="share-section">
            <h4>📤 Share Appointment</h4>
            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-outline btn-sm" (click)="shareWith('staff')">📱 Share with Staff</button>
              <button class="btn btn-outline btn-sm" (click)="shareWith('client')">📱 Share with Client</button>
            </div>
            <div *ngIf="shareMessage" class="share-preview">
              <textarea class="form-control" [value]="shareMessage" rows="4" readonly></textarea>
              <button class="btn btn-primary btn-sm mt-2" (click)="copyShare()">📋 Copy Message</button>
              <span *ngIf="copied" class="copied-tag">✓ Copied!</span>
            </div>
          </div>
        </div>

        <!-- Billing panel -->
        <div class="card billing-panel">
          <h3>💰 Billing</h3>
          <div *ngIf="bill; else noBill">
            <div class="bill-row"><span>Service</span><span>₹{{ bill.serviceAmount }}</span></div>
            <div class="bill-row" *ngIf="bill.taxPercent"><span>Tax ({{ bill.taxPercent }}%)</span><span>₹{{ (bill.serviceAmount * bill.taxPercent / 100).toFixed(2) }}</span></div>
            <div class="bill-row" *ngIf="bill.discountAmount"><span>Discount</span><span class="text-danger">-₹{{ bill.discountAmount }}</span></div>
            <div class="bill-divider"></div>
            <div class="bill-total"><span>Total</span><span>₹{{ bill.totalAmount }}</span></div>
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-secondary btn-sm" (click)="printBill()">🖨️ Print Bill</button>
              <button class="btn btn-outline btn-sm" (click)="shareBill()">📤 Share Bill</button>
            </div>
          </div>
          <ng-template #noBill>
            <p class="text-muted mb-3" style="font-size:13px;">No bill generated yet.</p>
            <div class="form-group">
              <label>Tax %</label>
              <input class="form-control" type="number" [(ngModel)]="billForm.taxPercent" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Discount (₹)</label>
              <input class="form-control" type="number" [(ngModel)]="billForm.discountAmount" placeholder="0" />
            </div>
            <div class="bill-preview">
              <div class="bill-row"><span>Service</span><span>₹{{ appointment.servicePrice }}</span></div>
              <div class="bill-row" *ngIf="billForm.taxPercent"><span>Tax</span><span>₹{{ (appointment.servicePrice * billForm.taxPercent / 100).toFixed(2) }}</span></div>
              <div class="bill-row" *ngIf="billForm.discountAmount"><span>Discount</span><span>-₹{{ billForm.discountAmount }}</span></div>
              <div class="bill-divider"></div>
              <div class="bill-total"><span>Total</span><span>₹{{ calcTotal() }}</span></div>
            </div>
            <button class="btn btn-primary" style="width:100%;" (click)="generateBill()" [disabled]="billLoading">
              {{ billLoading ? 'Generating...' : '🧾 Generate Bill' }}
            </button>
          </ng-template>
        </div>
      </div>
    </ng-container>

    <!-- Edit Modal -->
    <div class="modal-overlay" *ngIf="showEdit">
      <div class="modal">
        <div class="modal-header">
          <h2>Edit Appointment</h2>
          <button class="modal-close" (click)="showEdit = false">×</button>
        </div>
        <div class="form-group">
          <label>Client Name</label>
          <input class="form-control" [(ngModel)]="editForm.clientName" />
        </div>
        <div class="form-group">
          <label>Client Phone</label>
          <input class="form-control" [(ngModel)]="editForm.clientPhone" />
        </div>
        <div class="form-group">
          <label>Service</label>
          <select class="form-control" [(ngModel)]="editForm.service" (change)="onEditServiceChange()">
            <option *ngFor="let s of services" [value]="s.name">{{ s.name }} — ₹{{ s.price }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Price (₹)</label>
          <input class="form-control" type="number" [(ngModel)]="editForm.servicePrice" />
        </div>
        <div class="form-group">
          <label>Notes</label>
          <input class="form-control" [(ngModel)]="editForm.notes" />
        </div>
        <div class="d-flex gap-2 justify-between mt-3">
          <button class="btn btn-secondary" (click)="showEdit = false">Cancel</button>
          <button class="btn btn-primary" (click)="saveEdit()">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <div class="modal-overlay" *ngIf="showReschedule">
      <div class="modal">
        <div class="modal-header">
          <h2>Reschedule Appointment</h2>
          <button class="modal-close" (click)="showReschedule = false">×</button>
        </div>
        <div class="form-group">
          <label>New Date</label>
          <input class="form-control" type="date" [(ngModel)]="rescheduleForm.date" [min]="today" />
        </div>
        <div class="form-group">
          <label>New Time Slot</label>
          <select class="form-control" [(ngModel)]="rescheduleForm.timeSlot">
            <option value="">Select time</option>
            <option *ngFor="let t of timeSlots" [value]="t">{{ t }}</option>
          </select>
        </div>
        <div class="d-flex gap-2 justify-between mt-3">
          <button class="btn btn-secondary" (click)="showReschedule = false">Cancel</button>
          <button class="btn btn-primary" (click)="saveReschedule()">Reschedule</button>
        </div>
      </div>
    </div>

    <!-- Print Bill modal -->
    <div class="modal-overlay" *ngIf="showPrint">
      <div class="modal print-modal" id="printArea">
        <div class="bill-print">
          <div class="bill-header">
            <h2>✂️ Salon CRM</h2>
            <p>Tax Invoice</p>
          </div>
          <div class="bill-meta" *ngIf="bill && appointment">
            <div class="bill-meta-row"><span>Client</span><span>{{ appointment.clientName }}</span></div>
            <div class="bill-meta-row"><span>Phone</span><span>{{ appointment.clientPhone }}</span></div>
            <div class="bill-meta-row"><span>Staff</span><span>{{ appointment.staffName }}</span></div>
            <div class="bill-meta-row"><span>Date</span><span>{{ appointment.date }}</span></div>
            <div class="bill-meta-row"><span>Time</span><span>{{ appointment.timeSlot }}</span></div>
          </div>
          <table class="bill-table" *ngIf="bill">
            <thead><tr><th>Service</th><th>Amount</th></tr></thead>
            <tbody>
              <tr><td>{{ bill.service }}</td><td>₹{{ bill.serviceAmount }}</td></tr>
              <tr *ngIf="bill.taxPercent"><td>Tax ({{ bill.taxPercent }}%)</td><td>₹{{ (bill.serviceAmount * bill.taxPercent / 100).toFixed(2) }}</td></tr>
              <tr *ngIf="bill.discountAmount"><td>Discount</td><td>-₹{{ bill.discountAmount }}</td></tr>
            </tbody>
            <tfoot><tr><td><strong>Total</strong></td><td><strong>₹{{ bill.totalAmount }}</strong></td></tr></tfoot>
          </table>
          <p style="text-align:center; margin-top:16px; font-size:12px; color:#888;">Thank you for visiting!</p>
        </div>
        <div class="d-flex gap-2 mt-3 justify-between">
          <button class="btn btn-secondary btn-sm" (click)="showPrint = false">Close</button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .loading-state { padding: 60px; text-align: center; color: var(--text-muted); }
    .detail-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .detail-header h2 { font-size: 20px; font-weight: 700; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .detail-field { display: flex; flex-direction: column; gap: 4px; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
    .price { font-size: 18px; font-weight: 700; color: var(--primary); }
    .action-buttons { display: flex; gap: 8px; flex-wrap: wrap; padding: 16px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 16px; }
    .share-section { margin-top: 16px; }
    .share-section h4 { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
    .share-preview { margin-top: 12px; }
    .copied-tag { font-size: 12px; color: var(--success); margin-left: 8px; }
    h3 { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
    .bill-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px solid var(--border); }
    .bill-divider { border-top: 2px solid var(--text); margin: 8px 0; }
    .bill-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: var(--primary); padding: 6px 0; }
    .bill-preview { background: #f9fafb; border-radius: 8px; padding: 12px; margin: 12px 0; }
    .text-danger { color: var(--danger); }
    .bill-print { font-family: monospace; }
    .bill-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 12px; }
    .bill-header h2 { font-size: 22px; }
    .bill-meta { margin-bottom: 16px; }
    .bill-meta-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
    .bill-table { width: 100%; border-collapse: collapse; }
    .bill-table th, .bill-table td { padding: 8px; border: 1px solid #ddd; font-size: 13px; }
    .bill-table tfoot td { font-weight: bold; background: #f9fafb; }
    @media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; } .detail-grid { grid-template-columns: 1fr; } }
  `]
})
export class AppointmentDetailComponent implements OnInit {
    appointment: Appointment | null = null;
    bill: Bill | null = null;
    staffList: Staff[] = [];
    services = SERVICES;
    timeSlots = TIME_SLOTS;
    today = new Date().toISOString().split('T')[0];

    showEdit = false;
    showReschedule = false;
    showPrint = false;
    billLoading = false;
    shareMessage = '';
    copied = false;

    editForm: any = {};
    rescheduleForm: any = {};
    billForm = { taxPercent: 0, discountAmount: 0 };

    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.api.getAppointment(id).subscribe(a => {
            this.appointment = a;
            this.editForm = { ...a };
            this.rescheduleForm = { date: a.date, timeSlot: a.timeSlot };
            this.loadBill();
        });
    }

    loadBill() {
        this.api.getBillByAppointment(this.appointment!._id).subscribe({
            next: b => this.bill = b,
            error: () => this.bill = null
        });
    }

    onCancel() {
        if (!confirm('Cancel this appointment?')) return;
        this.api.cancelAppointment(this.appointment!._id).subscribe(() => {
            this.appointment!.status = 'cancelled';
        });
    }

    onMarkComplete() {
        this.api.updateAppointment(this.appointment!._id, { status: 'completed' }).subscribe(a => {
            this.appointment = a;
        });
    }

    saveEdit() {
        this.api.updateAppointment(this.appointment!._id, this.editForm).subscribe(a => {
            this.appointment = a;
            this.showEdit = false;
        });
    }

    onEditServiceChange() {
        const svc = this.services.find(s => s.name === this.editForm.service);
        if (svc) this.editForm.servicePrice = svc.price;
    }

    saveReschedule() {
        this.api.updateAppointment(this.appointment!._id, this.rescheduleForm).subscribe(a => {
            this.appointment = a;
            this.showReschedule = false;
        });
    }

    calcTotal(): number {
        const price = this.appointment?.servicePrice || 0;
        const tax = (price * this.billForm.taxPercent) / 100;
        return price + tax - this.billForm.discountAmount;
    }

    generateBill() {
        this.billLoading = true;
        const payload = {
            appointmentId: this.appointment!._id,
            clientName: this.appointment!.clientName,
            staffName: this.appointment!.staffName,
            service: this.appointment!.service,
            date: this.appointment!.date,
            timeSlot: this.appointment!.timeSlot,
            serviceAmount: this.appointment!.servicePrice,
            taxPercent: this.billForm.taxPercent,
            discountAmount: this.billForm.discountAmount,
        };
        this.api.createBill(payload).subscribe(b => {
            this.bill = b;
            this.billLoading = false;
        });
    }

    printBill() {
        this.showPrint = true;
    }

    shareBill() {
        if (!this.bill || !this.appointment) return;
        const msg = `💈 *Salon CRM - Bill*\n\nClient: ${this.bill.clientName}\nService: ${this.bill.service}\nStaff: ${this.bill.staffName}\nDate: ${this.bill.date} | ${this.bill.timeSlot}\n\nAmount: ₹${this.bill.serviceAmount}\nTax: ₹${(this.bill.serviceAmount * this.bill.taxPercent / 100).toFixed(2)}\nDiscount: -₹${this.bill.discountAmount}\n*Total: ₹${this.bill.totalAmount}*\n\nThank you for visiting!`;
        this.shareMessage = msg;
        this.copied = false;
    }

    shareWith(target: 'staff' | 'client') {
        if (!this.appointment) return;
        const a = this.appointment;
        const msg = target === 'staff'
            ? `📋 *New Appointment*\n\nClient: ${a.clientName} (${a.clientPhone})\nService: ${a.service}\nDate: ${a.date} | ${a.timeSlot}\nNotes: ${a.notes || 'None'}\n\nPlease be ready. - Salon CRM`
            : `💈 *Appointment Confirmed!*\n\nDear ${a.clientName},\nYour appointment is confirmed.\n\nService: ${a.service}\nStaff: ${a.staffName}\nDate: ${a.date}\nTime: ${a.timeSlot}\n\nSee you soon!`;
        this.shareMessage = msg;
        this.copied = false;
    }

    copyShare() {
        navigator.clipboard.writeText(this.shareMessage).then(() => {
            this.copied = true;
            setTimeout(() => this.copied = false, 3000);
        });
    }
}