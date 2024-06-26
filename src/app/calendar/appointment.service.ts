import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Appointment {
  id: number;
  title: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointment[] = [];
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): void {
    const newAppointment = { ...appointment, id: Date.now() };
    this.appointments.push(newAppointment);
    this.appointmentsSubject.next([...this.appointments]);
  }

  deleteAppointment(id: number): void {
    this.appointments = this.appointments.filter(app => app.id !== id);
    this.appointmentsSubject.next([...this.appointments]);
  }

  updateAppointment(updatedAppointment: Appointment): void {
    const index = this.appointments.findIndex(app => app.id === updatedAppointment.id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
      this.appointmentsSubject.next([...this.appointments]);
    }
  }
}