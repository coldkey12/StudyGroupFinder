import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentWeek: string[] = [];
  upcomingSessions = [
    { title: 'Web Development Midterm Prep', day: 'Tue', time: '14:00', room: 'Room 301' },
    { title: 'Statistics Revision', day: 'Thu', time: '16:00', room: 'Room 210' },
    { title: 'Database Practice', day: 'Fri', time: '12:00', room: 'Room 115' }
  ];

  ngOnInit(): void {
    this.currentWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }
}
