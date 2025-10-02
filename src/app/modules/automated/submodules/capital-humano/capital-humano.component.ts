import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';


@Component({
  selector: 'app-capital-humano',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './capital-humano.component.html',
  styleUrls: ['./capital-humano.component.css']
})
export class CapitalHumanoComponent { }

