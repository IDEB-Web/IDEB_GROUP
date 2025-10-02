import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent { // El nombre de la clase ya era correcto, aseguramos que se mantenga.

}
