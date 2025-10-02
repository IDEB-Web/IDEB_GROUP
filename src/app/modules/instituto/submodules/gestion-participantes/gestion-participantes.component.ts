import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


export interface Participante {
  id: number;
  nombre: string;
  correo: string;
  curso: string;
  estado: string;
}

const PARTICIPANTES_DATA: Participante[] = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juan@gmail.com', curso: 'Soldadura Industrial', estado: 'Activo' },
  { id: 2, nombre: 'María López', correo: 'maria@gmail.com', curso: 'Automatización de Máquinas', estado: 'Inactivo' },
  { id: 3, nombre: 'Carlos Méndez', correo: 'carlos@gmail.com', curso: 'Gestión de Proyectos', estado: 'Activo' },
];

@Component({
  selector: 'app-gestion-participantes',
  templateUrl: './gestion-participantes.component.html',
  styleUrls: ['./gestion-participantes.component.css'],
  standalone: true,

  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule

  ],
})
export class GestionParticipantesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'correo', 'curso', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Participante>(PARTICIPANTES_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editarParticipante(participante: Participante) {
    console.log('Editar:', participante);
  }

  eliminarParticipante(participante: Participante) {
    console.log('Eliminar:', participante);
  }
}
