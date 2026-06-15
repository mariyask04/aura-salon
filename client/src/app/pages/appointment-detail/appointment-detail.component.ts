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
    <div *ngIf="!appointment" class="loading-state">
      <div class="loading-ring"></div> Loading…
    </div>

    <ng-container *ngIf="appointment">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/appointments" class="back-link">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            Appointments
          </a>
          <h1>Appointment Details</h1>
        </div>
        <span class="badge"
              [class.badge-primary]="appointment.status==='booked'"
              [class.badge-success]="appointment.status==='completed'"
              [class.badge-danger]="appointment.status==='cancelled'">
          {{ appointment.status }}
        </span>
      </div>

      <div class="detail-grid">
        <!-- Left column -->
        <div class="left-col">
          <!-- Client card -->
          <div class="card section-card">
            <div class="section-label">Client</div>
            <div class="client-block">
              <div class="client-avatar">{{ appointment.clientName.charAt(0) }}</div>
              <div>
                <div class="client-name">{{ appointment.clientName }}</div>
                <div class="client-phone">{{ appointment.clientPhone }}</div>
              </div>
            </div>
          </div>

          <!-- Appointment info -->
          <div class="card section-card">
            <div class="section-label">Appointment</div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-key">Staff</span>
                <span class="info-val">{{ appointment.staffName }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">Service</span>
                <span class="info-val">{{ appointment.service }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">Date</span>
                <span class="info-val">{{ appointment.date }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">Time</span>
                <span class="info-val">{{ appointment.timeSlot }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">Price</span>
                <span class="info-val price-val">₹{{ appointment.servicePrice }}</span>
              </div>
              <div class="info-item" *ngIf="appointment.notes">
                <span class="info-key">Notes</span>
                <span class="info-val">{{ appointment.notes }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card section-card" *ngIf="appointment.status === 'booked'">
            <div class="section-label">Actions</div>
            <div class="action-row">
              <button class="btn btn-secondary btn-sm" (click)="showEdit = true">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                Edit
              </button>
              <button class="btn btn-secondary btn-sm" (click)="showReschedule = true">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                Reschedule
              </button>
              <button class="btn btn-success btn-sm" (click)="onMarkComplete()">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Mark Complete
              </button>
              <button class="btn btn-danger btn-sm" (click)="onCancel()">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                Cancel
              </button>
            </div>
          </div>

          <!-- Share -->
          <div class="card section-card">
            <div class="section-label">Share Appointment</div>
            <div class="share-btns">
              <button class="share-btn" (click)="shareWith('staff')">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>
                Notify Staff
              </button>
              <button class="share-btn" (click)="shareWith('client')">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                Notify Client
              </button>
            </div>
            <div *ngIf="shareMessage" class="share-preview">
              <div class="share-preview-label">Message Preview</div>
              <textarea class="form-control share-ta" [value]="shareMessage" rows="5" readonly></textarea>
              <div class="d-flex align-center gap-2 mt-2">
                <button class="btn btn-outline btn-sm" (click)="copyShare()">Copy Message</button>
                <span *ngIf="copied" class="copied-badge">✓ Copied</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Billing -->
        <div class="right-col">
          <div class="card billing-card">
            <div class="section-label">Billing</div>

            <div *ngIf="bill" class="bill-view">
              <div class="bill-line"><span>Service</span><span>₹{{ bill.serviceAmount }}</span></div>
              <div class="bill-line" *ngIf="bill.taxPercent">
                <span>Tax ({{ bill.taxPercent }}%)</span>
                <span>₹{{ (bill.serviceAmount * bill.taxPercent / 100).toFixed(2) }}</span>
              </div>
              <div class="bill-line discount-line" *ngIf="bill.discountAmount">
                <span>Discount</span>
                <span>−₹{{ bill.discountAmount }}</span>
              </div>
              <div class="bill-total-line">
                <span>Total</span>
                <span>₹{{ bill.totalAmount }}</span>
              </div>
              <div class="bill-actions">
                <button class="btn btn-secondary btn-sm" style="flex:1" (click)="showPrint = true">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9v-1h8v1H6zm1 2v-1h6v1H7z" clip-rule="evenodd"/></svg>
                  Print
                </button>
                <button class="btn btn-outline btn-sm" style="flex:1" (click)="shareBill()">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/></svg>
                  Share Bill
                </button>
              </div>
            </div>

            <div *ngIf="!bill" class="generate-bill">
              <div class="bill-row-input">
                <div class="form-group">
                  <label>Tax %</label>
                  <input class="form-control" type="number" [(ngModel)]="billForm.taxPercent" placeholder="0" min="0" max="100" />
                </div>
                <div class="form-group">
                  <label>Discount ₹</label>
                  <input class="form-control" type="number" [(ngModel)]="billForm.discountAmount" placeholder="0" min="0" />
                </div>
              </div>
              <div class="bill-preview-box">
                <div class="bill-line"><span>Service</span><span>₹{{ appointment.servicePrice }}</span></div>
                <div class="bill-line" *ngIf="billForm.taxPercent"><span>Tax</span><span>₹{{ (appointment.servicePrice * billForm.taxPercent / 100).toFixed(2) }}</span></div>
                <div class="bill-line discount-line" *ngIf="billForm.discountAmount"><span>Discount</span><span>−₹{{ billForm.discountAmount }}</span></div>
                <div class="bill-total-line"><span>Total</span><span>₹{{ calcTotal() }}</span></div>
              </div>
              <button class="btn btn-primary" style="width:100%" (click)="generateBill()" [disabled]="billLoading">
                {{ billLoading ? 'Generating…' : 'Generate Bill' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- Edit Modal -->
    <div class="modal-overlay" *ngIf="showEdit" (click)="showEdit=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Edit Appointment</h2>
          <button class="modal-close" (click)="showEdit=false">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <div class="form-row-2-modal">
          <div class="form-group"><label>Client Name</label><input class="form-control" [(ngModel)]="editForm.clientName" /></div>
          <div class="form-group"><label>Client Phone</label><input class="form-control" [(ngModel)]="editForm.clientPhone" /></div>
        </div>
        <div class="form-group">
          <label>Service</label>
          <select class="form-control" [(ngModel)]="editForm.service" (change)="onEditServiceChange()">
            <option *ngFor="let s of services" [value]="s.name">{{ s.name }} — ₹{{ s.price }}</option>
          </select>
        </div>
        <div class="form-row-2-modal">
          <div class="form-group"><label>Price (₹)</label><input class="form-control" type="number" [(ngModel)]="editForm.servicePrice" /></div>
          <div class="form-group"><label>Notes</label><input class="form-control" [(ngModel)]="editForm.notes" /></div>
        </div>
        <div class="d-flex gap-2 justify-between">
          <button class="btn btn-secondary" (click)="showEdit=false">Cancel</button>
          <button class="btn btn-primary" (click)="saveEdit()">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <div class="modal-overlay" *ngIf="showReschedule" (click)="showReschedule=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Reschedule</h2>
          <button class="modal-close" (click)="showReschedule=false">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
        </div>
        <div class="form-group"><label>New Date</label><input class="form-control" type="date" [(ngModel)]="rescheduleForm.date" [min]="today" /></div>
        <div class="form-group">
          <label>New Time Slot</label>
          <select class="form-control" [(ngModel)]="rescheduleForm.timeSlot">
            <option value="">Select time…</option>
            <option *ngFor="let t of timeSlots" [value]="t">{{ t }}</option>
          </select>
        </div>
        <div class="d-flex gap-2 justify-between">
          <button class="btn btn-secondary" (click)="showReschedule=false">Cancel</button>
          <button class="btn btn-primary" (click)="saveReschedule()">Confirm Reschedule</button>
        </div>
      </div>
    </div>

    <!-- Print Modal -->
    <div class="modal-overlay" *ngIf="showPrint" (click)="showPrint=false">
      <div class="modal print-modal" (click)="$event.stopPropagation()">
        <div class="receipt" id="printArea">
          <div class="receipt-header">
            <div class="receipt-logo">✂ Salon CRM</div>
            <div class="receipt-sub">TAX INVOICE</div>
          </div>
          <div class="receipt-meta" *ngIf="bill && appointment">
            <div class="rm-row"><span>Client</span><span>{{ appointment.clientName }}</span></div>
            <div class="rm-row"><span>Phone</span><span>{{ appointment.clientPhone }}</span></div>
            <div class="rm-row"><span>Staff</span><span>{{ appointment.staffName }}</span></div>
            <div class="rm-row"><span>Date</span><span>{{ appointment.date }}</span></div>
            <div class="rm-row"><span>Time</span><span>{{ appointment.timeSlot }}</span></div>
          </div>
          <div class="receipt-table" *ngIf="bill">
            <div class="rt-row header"><span>Description</span><span>Amount</span></div>
            <div class="rt-row"><span>{{ bill.service }}</span><span>₹{{ bill.serviceAmount }}</span></div>
            <div class="rt-row" *ngIf="bill.taxPercent"><span>Tax ({{ bill.taxPercent }}%)</span><span>₹{{ (bill.serviceAmount * bill.taxPercent / 100).toFixed(2) }}</span></div>
            <div class="rt-row discount" *ngIf="bill.discountAmount"><span>Discount</span><span>−₹{{ bill.discountAmount }}</span></div>
            <div class="rt-row total"><span>Total</span><span>₹{{ bill.totalAmount }}</span></div>
          </div>
          <div class="receipt-footer">Thank you for visiting Salon CRM!</div>
        </div>
        <div class="d-flex gap-2 justify-between mt-3">
          <button class="btn btn-secondary btn-sm" (click)="showPrint=false">Close</button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">Print Receipt</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-state { display: flex; align-items: center; gap: 12px; padding: 80px 40px; color: var(--muted); }
    .loading-ring { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--plum); border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .header-left { display: flex; flex-direction: column; gap: 4px; }
    .back-link { display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; color: var(--muted); text-decoration: none; margin-bottom: 4px; }
    .back-link:hover { color: var(--plum); }

    .detail-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
    .left-col { display: flex; flex-direction: column; gap: 16px; }
    .section-card { padding: 22px 24px; }
    .section-label {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 16px;
    }

    /* Client block */
    .client-block { display: flex; align-items: center; gap: 14px; }
    .client-avatar {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, var(--plum), #6D28D9);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700; color: #fff;
      flex-shrink: 0;
    }
    .client-name { font-size: 16px; font-weight: 700; color: var(--ink); }
    .client-phone { font-size: 13px; color: var(--muted); margin-top: 2px; }

    /* Info grid */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    .info-item { padding: 10px 0; border-bottom: 1px solid var(--border-soft); display: flex; flex-direction: column; gap: 3px; }
    .info-item:nth-last-child(-n+2) { border-bottom: none; }
    .info-key { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; color: var(--muted); }
    .info-val { font-size: 13.5px; color: var(--ink); font-weight: 500; }
    .price-val { font-size: 17px; font-weight: 700; color: var(--plum); }

    /* Actions */
    .action-row { display: flex; gap: 8px; flex-wrap: wrap; }

    /* Share */
    .share-btns { display: flex; gap: 10px; }
    .share-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 10px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--canvas);
      color: var(--ink-soft);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
    }
    .share-btn:hover { border-color: var(--plum); color: var(--plum); background: var(--plum-light); }
    .share-preview { margin-top: 16px; }
    .share-preview-label { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
    .share-ta { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; line-height: 1.6; resize: none; }
    .copied-badge { font-size: 12px; font-weight: 600; color: var(--emerald); background: var(--emerald-bg); padding: 3px 9px; border-radius: 12px; }

    /* Billing */
    .billing-card { padding: 22px 24px; }
    .right-col { position: sticky; top: 24px; }
    .bill-view { }
    .bill-line { display: flex; justify-content: space-between; padding: 9px 0; font-size: 13.5px; color: var(--ink-soft); border-bottom: 1px solid var(--border-soft); }
    .discount-line { color: #B91C1C; }
    .bill-total-line { display: flex; justify-content: space-between; padding: 12px 0 16px; font-size: 16px; font-weight: 700; color: var(--plum); }
    .bill-actions { display: flex; gap: 8px; }
    .generate-bill { }
    .bill-row-input { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .bill-preview-box { background: var(--canvas); border-radius: 8px; padding: 14px; margin: 16px 0; border: 1px solid var(--border-soft); }

    .form-row-2-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* Receipt */
    .print-modal { max-width: 420px; }
    .receipt { font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace; }
    .receipt-header { text-align: center; padding-bottom: 16px; border-bottom: 2px solid var(--ink); margin-bottom: 16px; }
    .receipt-logo { font-size: 18px; font-weight: 700; letter-spacing: 0.05em; }
    .receipt-sub { font-size: 11px; letter-spacing: 0.15em; color: var(--muted); margin-top: 4px; }
    .receipt-meta { margin-bottom: 16px; }
    .rm-row { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; }
    .receipt-table { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 16px; }
    .rt-row { display: flex; justify-content: space-between; font-size: 12.5px; padding: 7px 0; border-bottom: 1px solid var(--border-soft); }
    .rt-row.header { font-weight: 700; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
    .rt-row.discount { color: #B91C1C; }
    .rt-row.total { font-weight: 700; font-size: 14px; color: var(--plum); border-bottom: none; padding-top: 10px; }
    .receipt-footer { text-align: center; font-size: 11.5px; color: var(--muted); }

    @media (max-width: 860px) {
      .detail-grid { grid-template-columns: 1fr; }
      .right-col { position: static; }
      .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AppointmentDetailComponent implements OnInit {
  appointment: Appointment | null = null;
  bill: Bill | null = null;
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
    this.api.getBillByAppointment(this.appointment!._id).subscribe({ next: b => this.bill = b, error: () => this.bill = null });
  }

  onCancel() {
    if (!confirm('Cancel this appointment?')) return;
    this.api.cancelAppointment(this.appointment!._id).subscribe(() => { this.appointment!.status = 'cancelled'; });
  }

  onMarkComplete() {
    this.api.updateAppointment(this.appointment!._id, { status: 'completed' }).subscribe(a => this.appointment = a);
  }

  saveEdit() {
    this.api.updateAppointment(this.appointment!._id, this.editForm).subscribe(a => { this.appointment = a; this.showEdit = false; });
  }

  onEditServiceChange() {
    const s = this.services.find(x => x.name === this.editForm.service);
    if (s) this.editForm.servicePrice = s.price;
  }

  saveReschedule() {
    this.api.updateAppointment(this.appointment!._id, this.rescheduleForm).subscribe(a => { this.appointment = a; this.showReschedule = false; });
  }

  calcTotal(): number {
    const price = this.appointment?.servicePrice || 0;
    return price + (price * this.billForm.taxPercent / 100) - this.billForm.discountAmount;
  }

  generateBill() {
    this.billLoading = true;
    this.api.createBill({
      appointmentId: this.appointment!._id,
      clientName: this.appointment!.clientName,
      staffName: this.appointment!.staffName,
      service: this.appointment!.service,
      date: this.appointment!.date,
      timeSlot: this.appointment!.timeSlot,
      serviceAmount: this.appointment!.servicePrice,
      taxPercent: this.billForm.taxPercent,
      discountAmount: this.billForm.discountAmount,
    }).subscribe(b => { this.bill = b; this.billLoading = false; });
  }

  shareBill() {
    if (!this.bill) return;
    const b = this.bill;
    this.shareMessage = `💈 SALON CRM — BILL\n\nClient: ${b.clientName}\nService: ${b.service}\nStaff: ${b.staffName}\nDate: ${b.date} | ${b.timeSlot}\n\nAmount: ₹${b.serviceAmount}${b.taxPercent ? `\nTax (${b.taxPercent}%): ₹${(b.serviceAmount * b.taxPercent / 100).toFixed(2)}` : ''}${b.discountAmount ? `\nDiscount: −₹${b.discountAmount}` : ''}\nTotal: ₹${b.totalAmount}\n\nThank you for visiting!`;
    this.copied = false;
  }

  shareWith(target: 'staff' | 'client') {
    const a = this.appointment!;
    this.shareMessage = target === 'staff'
      ? `📋 APPOINTMENT — ${a.date} ${a.timeSlot}\n\nClient: ${a.clientName} (${a.clientPhone})\nService: ${a.service}\nNotes: ${a.notes || 'None'}\n\nPlease prepare accordingly. — Salon CRM`
      : `💈 APPOINTMENT CONFIRMED\n\nDear ${a.clientName},\n\nYour appointment is confirmed.\nService: ${a.service}\nStaff: ${a.staffName}\nDate: ${a.date}\nTime: ${a.timeSlot}\n\nSee you soon! — Salon CRM`;
    this.copied = false;
  }

  copyShare() {
    navigator.clipboard.writeText(this.shareMessage).then(() => { this.copied = true; setTimeout(() => this.copied = false, 2500); });
  }
}
