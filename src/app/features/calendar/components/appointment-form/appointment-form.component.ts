import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Appointment } from '../../../../core/models/appointment.model';
import { Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { FormService } from '../../../../core/services/form.service'; // Імпортуємо FormService

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
})
export class AppointmentFormComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date = new Date();
  @Input() appointment: Appointment | null = null;
  @Output() formClosed = new EventEmitter<void>();

  appointmentForm: FormGroup;
  isEditMode = false;
  colorOptions = [
    { value: '#4285f4', name: 'Blue' },
    { value: '#0f9d58', name: 'Green' },
    { value: '#f4b400', name: 'Yellow' },
    { value: '#db4437', name: 'Red' },
    { value: '#673ab7', name: 'Purple' },
  ];

  constructor(
    private formService: FormService, // Використовуємо FormService
    private appointmentService: AppointmentService
  ) {
    this.appointmentForm = this.formService.createAppointmentForm(); // Створюємо форму через сервіс
  }

  ngOnInit(): void {
    if (!this.appointment) {
      this.appointmentForm.get('date')?.setValue(this.selectedDate);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointment'] && this.appointment) {
      this.isEditMode = true;
      this.formService.patchFormValue(this.appointmentForm, this.appointment); // Патчимо значення через сервіс
    } else if (changes['selectedDate'] && !this.isEditMode) {
      this.appointmentForm.get('date')?.setValue(this.selectedDate);
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      return;
    }

    const formValue = this.appointmentForm.value;
    const appointmentData: Appointment = {
      id: this.isEditMode && this.appointment ? this.appointment.id : uuidv4(),
      title: formValue.title,
      description: formValue.description,
      date: formValue.date,
      startTime: formValue.startTime,
      endTime: formValue.endTime,
      color: formValue.color,
    };

    if (this.isEditMode) {
      this.appointmentService.updateAppointment(appointmentData);
    } else {
      this.appointmentService.addAppointment(appointmentData);
    }

    this.formClosed.emit();
  }

  onCancel(): void {
    this.formClosed.emit();
  }

  get selectedColorName(): string {
    return (
      this.colorOptions.find(
        (c) => c.value === this.appointmentForm.get('color')?.value
      )?.name || 'Unknown'
    );
  }

  validateTime(): void {
    this.formService.validateTime(this.appointmentForm); // Валідація часу через сервіс
  }

}