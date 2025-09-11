import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasComponent } from './ventas.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: VentasComponent }
    ])
  ]
})
export class VentasModule {}
