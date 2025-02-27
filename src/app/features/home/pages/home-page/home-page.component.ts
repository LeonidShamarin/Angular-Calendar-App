import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  constructor(private router: Router) {}

  navigateToCalendar(): void {
    this.router.navigate(['/calendar']);
  }
}
