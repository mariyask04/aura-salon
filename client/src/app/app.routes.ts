import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: 'calendar', loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent) },
      { path: 'appointments', loadComponent: () => import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent) },
      { path: 'appointments/new', loadComponent: () => import('./pages/appointment-booking/appointment-booking.component').then(m => m.AppointmentBookingComponent) },
      { path: 'appointments/:id', loadComponent: () => import('./pages/appointment-detail/appointment-detail.component').then(m => m.AppointmentDetailComponent) },
      { path: 'staff', loadComponent: () => import('./pages/staff/staff.component').then(m => m.StaffComponent) },
      { path: 'clients', loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent) },
      { path: 'billing', loadComponent: () => import('./pages/billing/billing.component').then(m => m.BillingComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];