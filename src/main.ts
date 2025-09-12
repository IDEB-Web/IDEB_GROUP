import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';   // 👈 IMPORTANTE

import { LayoutComponent } from './app/shared/layout/layout.component';
import { routes } from './app/app.routes';

bootstrapApplication(LayoutComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // 👈 importante

  ]
}).catch(err => console.error(err));
