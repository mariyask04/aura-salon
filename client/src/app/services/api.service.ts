import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Appointment, Staff, Client, Bill } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  // Appointments
  getAppointments(date?: string, staffId?: string): Observable<Appointment[]> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    if (staffId) params = params.set('staffId', staffId);
    return this.http.get<Appointment[]>(`${this.base}/appointments`, { headers: this.headers(), params });
  }

  getAppointment(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.base}/appointments/${id}`, { headers: this.headers() });
  }

  createAppointment(data: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.base}/appointments`, data, { headers: this.headers() });
  }

  updateAppointment(id: string, data: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.base}/appointments/${id}`, data, { headers: this.headers() });
  }

  cancelAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.base}/appointments/${id}`, { headers: this.headers() });
  }

  // Staff
  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.base}/staff`, { headers: this.headers() });
  }

  createStaff(data: Partial<Staff>): Observable<Staff> {
    return this.http.post<Staff>(`${this.base}/staff`, data, { headers: this.headers() });
  }

  updateStaff(id: string, data: Partial<Staff>): Observable<Staff> {
    return this.http.put<Staff>(`${this.base}/staff/${id}`, data, { headers: this.headers() });
  }

  deleteStaff(id: string): Observable<any> {
    return this.http.delete(`${this.base}/staff/${id}`, { headers: this.headers() });
  }

  // Clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.base}/clients`, { headers: this.headers() });
  }

  createClient(data: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(`${this.base}/clients`, data, { headers: this.headers() });
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.base}/clients/${id}`, data, { headers: this.headers() });
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.base}/clients/${id}`, { headers: this.headers() });
  }

  // Billing
  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.base}/billing`, { headers: this.headers() });
  }

  getBillByAppointment(appointmentId: string): Observable<Bill> {
    return this.http.get<Bill>(`${this.base}/billing/appointment/${appointmentId}`, { headers: this.headers() });
  }

  createBill(data: Partial<Bill>): Observable<Bill> {
    return this.http.post<Bill>(`${this.base}/billing`, data, { headers: this.headers() });
  }
}