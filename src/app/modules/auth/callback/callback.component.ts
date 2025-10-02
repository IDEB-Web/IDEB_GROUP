import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="callback-message">Autenticación exitosa. Redirigiendo...</div>`,
})
export class CallbackComponent {}
