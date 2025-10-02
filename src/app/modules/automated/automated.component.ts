import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-automated',
  standalone: true,
  templateUrl: './automated.component.html',
  styleUrls: ['./automated.component.css'],
  imports: [CommonModule, RouterModule]
})
export class AutomatedComponent {
  constructor(public router: Router) { }
}


