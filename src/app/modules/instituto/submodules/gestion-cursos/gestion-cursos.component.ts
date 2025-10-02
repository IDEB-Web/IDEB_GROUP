import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Curso {
  id: number;
  nombre: string;
  modalidad: 'Presencial' | 'En línea' | 'Mixta';
  fechaInicio: Date;
  fechaFin: Date;
  duracion: string;
  estado: 'Activo' | 'Inactivo' | 'Completo' | 'Cancelado';
  instructor: string;
}

@Component({
  selector: 'app-gestion-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './gestion-cursos.component.html',
  styleUrls: ['./gestion-cursos.component.css']
})
export class GestionCursosComponent {
  searchQuery: string = '';
  filterEstado: string = '';

  cursos: Curso[] = [
    { id: 1, nombre: 'Curso de Soldadura Industrial', modalidad: 'Presencial', fechaInicio: new Date('2025-09-01'), fechaFin: new Date('2025-09-30'), duracion: '40 hrs', estado: 'Activo', instructor: 'Ing. Pérez' },
    { id: 2, nombre: 'Automatización de Máquinas', modalidad: 'En línea', fechaInicio: new Date('2025-10-05'), fechaFin: new Date('2025-11-05'), duracion: '60 hrs', estado: 'Inactivo', instructor: 'Ing. Gómez' },
    { id: 3, nombre: 'Mantenimiento Preventivo', modalidad: 'Mixta', fechaInicio: new Date('2025-09-15'), fechaFin: new Date('2025-10-15'), duracion: '50 hrs', estado: 'Activo', instructor: 'Ing. Ramírez' },
    { id: 4, nombre: 'Gestión de Calidad', modalidad: 'Presencial', fechaInicio: new Date('2025-09-20'), fechaFin: new Date('2025-10-20'), duracion: '35 hrs', estado: 'Completo', instructor: 'Lic. López' },
  ];

  get filteredCursos() {
    return this.cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.filterEstado ? curso.estado === this.filterEstado : true)
    );
  }

  editarCurso(curso: Curso) {
    alert(`Editar curso: ${curso.nombre}`);
  }

  verDetalles(curso: Curso) {
    alert(`Ver detalles del curso: ${curso.nombre}`);
  }

  cambiarEstado(curso: Curso) {
    const nuevoEstado = prompt('Nuevo estado (Activo, Inactivo, Completo, Cancelado):', curso.estado);
    if (nuevoEstado === 'Activo' || nuevoEstado === 'Inactivo' || nuevoEstado === 'Completo' || nuevoEstado === 'Cancelado') {
      curso.estado = nuevoEstado as Curso['estado'];
    }
  }

  eliminarCurso(curso: Curso) {
    if (confirm(`¿Eliminar el curso "${curso.nombre}"?`)) {
      this.cursos = this.cursos.filter(c => c.id !== curso.id);
    }
  }
}






