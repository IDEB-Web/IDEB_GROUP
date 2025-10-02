import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tema',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tema.component.html',
  styleUrls: ['./tema.component.css']
})
export class TemaComponent {
  currentTheme: 'claro' | 'oscuro' = 'claro';
  colorPrincipal: string = '#007bff'; // azul por defecto

  ngOnInit() {
    const savedTheme = localStorage.getItem('tema') as 'claro' | 'oscuro' | null;
    const savedColor = localStorage.getItem('colorPrincipal');
    if (savedTheme) this.cambiarTema(savedTheme);
    if (savedColor) this.cambiarColor(savedColor);
  }

  cambiarTema(tema: 'claro' | 'oscuro') {
    this.currentTheme = tema;
    document.body.classList.remove('tema-claro', 'tema-oscuro');
    document.body.classList.add(`tema-${tema}`);
    localStorage.setItem('tema', tema);
  }

  cambiarColor(color: string) {
    this.colorPrincipal = color;
    document.documentElement.style.setProperty('--primary-color', color);
    localStorage.setItem('colorPrincipal', color);
  }
}
