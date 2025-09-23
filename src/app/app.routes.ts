import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { InstitutoComponent } from './modules/instituto/instituto.component';
import { AutomatedComponent } from './modules/automated/automated.component';
import { SeatiComponent } from './modules/seati/seati.component';
import { RegisterComponent } from './modules/register/register.component';
import { UserApprovalComponent } from './admin/user-approval.component';

import { adminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

// Submódulos Instituto
import { GestionCursosComponent } from './modules/instituto/submodules/gestion-cursos/gestion-cursos.component';
import { GestionParticipantesComponent } from './modules/instituto/submodules/gestion-participantes/gestion-participantes.component';
import { GeneracionDocsComponent } from './modules/instituto/submodules/generacion-docs/generacion-docs.component';
import { GestionInstructoresComponent } from './modules/instituto/submodules/gestion-instructores/gestion-instructores.component';
import { FinanzasComponent as InstitutoFinanzasComponent } from './modules/instituto/submodules/finanzas/finanzas.component';
import { ComprasComponent as InstitutoComprasComponent } from './modules/instituto/submodules/compras/compras.component';
import { RecursosMaterialesComponent as InstitutoRecursosMaterialesComponent } from './modules/instituto/submodules/recursos-materiales/recursos-materiales.component';
import { CapitalHumanoComponent as InstitutoCapitalHumanoComponent } from './modules/instituto/submodules/capital-humano/capital-humano.component';
import { PortalWebComponent } from './modules/instituto/submodules/portal-web/portal-web.component';
import { VentasComponent as InstitutoVentasComponent } from './modules/instituto/submodules/ventas/ventas.component';

// Submódulos Automated
import { GestProyectosComponent } from './modules/automated/submodules/gest-proyectos/gest-proyectos.component';
import { IngenieriaComponent } from './modules/automated/submodules/ingenieria/ingenieria.component';
import { GestPedidosComponent } from './modules/automated/submodules/gest-pedidos/gest-pedidos.component';
import { FinanzasComponent as AutomatedFinanzasComponent } from './modules/automated/submodules/finanzas/finanzas.component';
import { ComprasComponent as AutomatedComprasComponent } from './modules/automated/submodules/compras/compras.component';
import { CapitalHumanoComponent as AutomatedCapitalHumanoComponent } from './modules/automated/submodules/capital-humano/capital-humano.component';
import { RecursosMatComponent } from './modules/automated/submodules/recursos-materiales/recursos-mat.component';
import { VentasComponent } from './modules/automated/submodules/ventas/ventas.component';
import { PostVentasComponent } from './modules/automated/submodules/post-ventas/post-ventas.component';

// Submódulos Nivel2 - Capital Humano
import { ColaboradoresComponent } from './modules/automated/submodules/capital-humano/submodules/colaboradores.component';
import { PractEstadiasComponent } from './modules/automated/submodules/capital-humano/submodules/pract-estadias.component';
import { GestTiemposComponent } from './modules/automated/submodules/capital-humano/submodules/gest-tiempos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // Instituto
  {
    path: 'instituto',
    component: InstitutoComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'gestion-cursos', component: GestionCursosComponent },
      { path: 'gestion-participantes', component: GestionParticipantesComponent },
      { path: 'generacion-docs', component: GeneracionDocsComponent },
      { path: 'gestion-instructores', component: GestionInstructoresComponent },
      { path: 'finanzas', component: InstitutoFinanzasComponent },
      { path: 'compras', component: InstitutoComprasComponent },
      { path: 'recursos-materiales', component: InstitutoRecursosMaterialesComponent },
      { path: 'capital-humano', component: InstitutoCapitalHumanoComponent },
      { path: 'portal-web', component: PortalWebComponent },
      { path: 'ventas', component: InstitutoVentasComponent },
    ]
  },

  // Automated
  {
    path: 'automated',
    component: AutomatedComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'gest-proyectos', component: GestProyectosComponent },
      { path: 'gest-pedidos', component: GestPedidosComponent },
      { path: 'ingenieria', component: IngenieriaComponent },
      { path: 'finanzas', component: AutomatedFinanzasComponent },
      { path: 'compras', component: AutomatedComprasComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'post-ventas', component: PostVentasComponent },
      { path: 'recursos-materiales', component: RecursosMatComponent },
      { path: 'capital-humano', component: AutomatedCapitalHumanoComponent },
      { path: 'capital-humano/colaboradores', component: ColaboradoresComponent },
      { path: 'capital-humano/pract-estadias', component: PractEstadiasComponent },
      { path: 'capital-humano/gest-tiempos', component: GestTiemposComponent }
    ]
  },

  // Otros
  { path: 'seati', component: SeatiComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },

  // Admin
  {
    path: 'admin/usuarios',
    component: UserApprovalComponent,
    canActivate: [AuthGuard, adminGuard]
  },
];
