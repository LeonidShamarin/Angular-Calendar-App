import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private currentDate = new Date();
  private calendarDaysSubject = new BehaviorSubject<CalendarDay[]>([]);

  getCalendarDays(): Observable<CalendarDay[]> {
    return this.calendarDaysSubject.asObservable();
  }

  setCurrentDate(date: Date): void {
    this.currentDate = date;
    this.generateCalendarDays();
  }

  private generateCalendarDays(): void {
    const startDate = startOfWeek(startOfMonth(this.currentDate));
    const endDate = endOfWeek(endOfMonth(this.currentDate));

    const calendarDays: CalendarDay[] = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      calendarDays.push({
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === this.currentDate.getMonth(),
      });
      currentDate = addDays(currentDate, 1);
    }

    this.calendarDaysSubject.next(calendarDays);
  }
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}