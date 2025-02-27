import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormService {
  constructor(private fb: FormBuilder) {}

  createAppointmentForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
      date: [new Date(), Validators.required],
      startTime: [
        '09:00',
        [
          Validators.required,
          Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'),
        ],
      ],
      endTime: [
        '10:00',
        [
          Validators.required,
          Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'),
        ],
      ],
      color: ['#4285f4'],
    });
  }

  patchFormValue(form: FormGroup, appointment: any): void {
    form.patchValue({
      title: appointment.title,
      description: appointment.description,
      date: new Date(appointment.date),
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      color: appointment.color,
    });
  }

  validateTime(form: FormGroup): void {
    const startControl = form.get('startTime');
    const endControl = form.get('endTime');

    if (startControl && endControl && startControl.value && endControl.value) {
      const startTime = startControl.value;
      const endTime = endControl.value;

      if (startTime >= endTime) {
        endControl.setErrors({ endBeforeStart: true });
      } else {
        const currentErrors = endControl.errors;
        if (currentErrors) {
          delete currentErrors['endBeforeStart'];
          endControl.setErrors(
            Object.keys(currentErrors).length === 0 ? null : currentErrors
          );
        }
      }
    }
  }
}