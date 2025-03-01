import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { CalendarViewComponent } from '../../components/calendar-view/calendar-view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Appointment } from './../../../../core/models/appointment.model';
import { NgIf } from '@angular/common'; 
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';


@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [
    CalendarViewComponent,
    MatButtonModule,
    MatIconModule,
    NgIf, 
    AppointmentFormComponent 
  ],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent {
  showAppointmentForm = false;
  currentDate = new Date();
  selectedAppointment: Appointment | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {}

  toggleAppointmentForm(): void {
    this.showAppointmentForm = !this.showAppointmentForm;
    if (!this.showAppointmentForm) {
      this.selectedAppointment = null;
    }
  }

  handleAppointmentSelect(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.showAppointmentForm = true;
  }

  openAppointmentForm(): void {
    this.showAppointmentForm = true;
    this.selectedAppointment = null; 
  }

  changeMonth(increment: number): void {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    this.currentDate = newDate;
  }

  onAppointmentSelected(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }
  
  onFormClosed(): void {
    this.selectedAppointment = null;
  }
}