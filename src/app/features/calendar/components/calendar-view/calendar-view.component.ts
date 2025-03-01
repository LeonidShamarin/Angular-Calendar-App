import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { Appointment } from '../../../../core/models/appointment.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropService } from './../../../../core/services/drag-drop.service';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
// 
export class CalendarViewComponent implements OnInit, OnChanges {
  @Input() currentDate: Date = new Date();
  @Output() appointmentSelected = new EventEmitter<Appointment>();
  
  calendarDays: CalendarDay[] = [];
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private dragDropService: DragDropService
  ) {}

  ngOnInit(): void {
    this.generateCalendarDays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate']) {
      this.generateCalendarDays();
    }
  }

  generateCalendarDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first day of week containing the first day of month
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // End on the last day of week containing the last day of month
    const endDate = new Date(lastDay);
    if (endDate.getDay() < 6) {
      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    }
    
    this.calendarDays = [];
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      this.calendarDays.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        appointments: [] // Will be populated from subscription
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Load appointments
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      // Reset appointments for all days
      this.calendarDays.forEach(day => day.appointments = []);
      
      // Distribute appointments to their respective days
      appointments.forEach(appointment => {
        const dayIndex = this.calendarDays.findIndex(day => 
          day.date.getDate() === appointment.date.getDate() &&
          day.date.getMonth() === appointment.date.getMonth() &&
          day.date.getFullYear() === appointment.date.getFullYear()
        );
        
        if (dayIndex !== -1) {
          this.calendarDays[dayIndex].appointments.push(appointment);
        }
      });
    });
  }

  onAppointmentClick(appointment: Appointment, event: MouseEvent): void {
    event.stopPropagation();
    this.appointmentSelected.emit(appointment);
  }
  editAppointment(appointment: Appointment, event: MouseEvent): void {
    event.stopPropagation();
    this.appointmentSelected.emit(appointment);
  }
  deleteAppointment(appointment: Appointment, event: MouseEvent): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Appointment',
        message: `Are you sure you want to delete "${appointment.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.deleteAppointment(appointment.id);
      }
    });
  }

  onDrop(event: CdkDragDrop<any[]>, dayIndex: number) {
    this.dragDropService.drop(event);

    // Оновіть дату призначення, якщо воно переміщено на інший день
    if (event.previousContainer !== event.container) {
      const appointment = event.container.data[event.currentIndex];
      appointment.date = this.calendarDays[dayIndex].date;
      this.appointmentService.updateAppointment(appointment);
    }
  }

  getConnectedLists(): string[] {
    return this.calendarDays.map((_, index) => `cdk-drop-list-${index}`);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}