import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
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
import { CalendarService } from '../../../../core/services/calendar.service';
import { Subscription } from 'rxjs';

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
export class CalendarViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currentDate: Date = new Date();
  @Output() appointmentSelected = new EventEmitter<Appointment>();
  
  calendarDays: CalendarDay[] = [];
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private calendarSubscription: Subscription | null = null;
  private appointmentSubscription: Subscription | null = null;
  
  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private dragDropService: DragDropService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.calendarService.setCurrentDate(this.currentDate);
    this.subscribeToCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate']) {
      this.calendarService.setCurrentDate(this.currentDate);
    }
  }

  ngOnDestroy(): void {
    if (this.calendarSubscription) {
      this.calendarSubscription.unsubscribe();
    }
    if (this.appointmentSubscription) {
      this.appointmentSubscription.unsubscribe();
    }
  }

  subscribeToCalendar(): void {
    this.calendarSubscription = this.calendarService.getCalendarDays().subscribe(days => {
      this.calendarDays = days.map(day => ({
        ...day,
        appointments: []
      }));
      this.loadAppointments();
    });
  }

  previousMonth(): void {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentDate = newDate;
    this.calendarService.setCurrentDate(this.currentDate);
  }

  nextMonth(): void {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentDate = newDate;
    this.calendarService.setCurrentDate(this.currentDate);
  }

  loadAppointments(): void {
    if (this.appointmentSubscription) {
      this.appointmentSubscription.unsubscribe();
    }
    
    this.appointmentSubscription = this.appointmentService.getAppointments().subscribe(appointments => {
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

    // Update appointment date if moved to a different day
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