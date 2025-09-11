import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CapitalHumanoComponent } from './capital-humano.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CapitalHumanoComponent }
    ])
  ]
})
export class CapitalHumanoModule {}
