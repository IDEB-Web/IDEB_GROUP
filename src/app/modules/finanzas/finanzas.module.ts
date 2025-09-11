import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinanzasComponent } from './finanzas.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FinanzasComponent }
    ])
  ]
})
export class FinanzasModule {}
