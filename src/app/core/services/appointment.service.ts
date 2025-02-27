import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointment[] = [];
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  
  constructor() {
    // Load appointments from localStorage if available
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      this.appointments = JSON.parse(savedAppointments).map((app: any) => ({
        ...app,
        date: new Date(app.date)
      }));
      this.appointmentsSubject.next([...this.appointments]);
    }
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  addAppointment(appointment: Appointment): void {
    this.appointments.push(appointment);
    this.updateAppointments();
  }

  updateAppointment(updatedAppointment: Appointment): void {
    const index = this.appointments.findIndex(a => a.id === updatedAppointment.id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
      this.updateAppointments();
    }
  }

  deleteAppointment(id: string): void {
    this.appointments = this.appointments.filter(a => a.id !== id);
    this.updateAppointments();
  }

  private updateAppointments(): void {
    this.appointmentsSubject.next([...this.appointments]);
    // Save to localStorage
    localStorage.setItem('appointments', JSON.stringify(this.appointments));
  }

  getAppointmentsByDate(date: Date): Observable<Appointment[]> {
    return new Observable<Appointment[]>(observer => {
      observer.next(this.appointments.filter(app => 
        app.date.getDate() === date.getDate() &&
        app.date.getMonth() === date.getMonth() &&
        app.date.getFullYear() === date.getFullYear()
      ));
      observer.complete();
    });
  }
}