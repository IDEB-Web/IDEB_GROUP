import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentacionComponent } from './documentacion.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: DocumentacionComponent }
    ])
  ]
})
export class DocumentacionModule {}
