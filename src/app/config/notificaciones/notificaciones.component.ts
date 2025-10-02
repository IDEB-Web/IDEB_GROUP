import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Aquí puedes tener tu servicio de notificaciones
import { ReactiveFormsModule } from '@angular/forms';

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha: Date;
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  mostrarPanel = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    // Simulación de carga desde backend
    // Aquí puedes reemplazar con tu servicio real:
    this.notificaciones = [
      { id: 1, titulo: 'Bienvenido', mensaje: 'Tu cuenta fue creada con éxito', leida: false, fecha: new Date() },
      { id: 2, titulo: 'Recordatorio', mensaje: 'Actualiza tu perfil', leida: false, fecha: new Date() },
      { id: 3, titulo: 'Mensaje', mensaje: 'Nuevo mensaje recibido', leida: true, fecha: new Date() },
    ];
  }

  togglePanel() {
    this.mostrarPanel = !this.mostrarPanel;
  }

  marcarLeida(notif: Notificacion) {
    notif.leida = true;
  }

  get notificacionesPendientes() {
    return this.notificaciones.filter(n => !n.leida).length;
  }
}
