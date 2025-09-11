import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursosMaterialesComponent } from './recursos-materiales.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: RecursosMaterialesComponent }
    ])
  ]
})
export class RecursosMaterialesModule {}
