// export interface Appointment {
//   id: string;
//   title: string;
//   description: string;
//   startDate: Date;
//   endDate: Date;
//   color: string;
// }
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  color?: string;
}