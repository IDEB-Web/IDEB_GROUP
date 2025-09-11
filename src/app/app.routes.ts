import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';


export const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: 'register', loadComponent: () => import('./modules/register/register.component').then(m => m.RegisterComponent) },
			{ path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
			{ path: 'instituto',
			  loadComponent: () => import('./modules/instituto/instituto.component').then(m => m.InstitutoComponent),
			  children: [
			    { path: 'gestion-cursos', loadComponent: () => import('./modules/instituto/submodules/gestion-cursos.component').then(m => m.GestionCursosComponent) },
			    { path: 'gestion-participantes', loadComponent: () => import('./modules/instituto/submodules/gestion-participantes.component').then(m => m.GestionParticipantesComponent) },
			    { path: 'generacion-docs', loadComponent: () => import('./modules/instituto/submodules/generacion-docs.component').then(m => m.GeneracionDocsComponent) },
			    { path: 'gestion-instructores', loadComponent: () => import('./modules/instituto/submodules/gestion-instructores.component').then(m => m.GestionInstructoresComponent) },
			    { path: 'finanzas', loadComponent: () => import('./modules/instituto/submodules/finanzas.component').then(m => m.FinanzasComponent) },
			    { path: 'compras', loadComponent: () => import('./modules/instituto/submodules/compras.component').then(m => m.ComprasComponent) },
			    { path: 'recursos-materiales', loadComponent: () => import('./modules/instituto/submodules/recursos-materiales.component').then(m => m.RecursosMaterialesComponent) },
			    { path: 'capital-humano', loadComponent: () => import('./modules/instituto/submodules/capital-humano.component').then(m => m.CapitalHumanoComponent) },
			    { path: 'portal-web', loadComponent: () => import('./modules/instituto/submodules/portal-web.component').then(m => m.PortalWebComponent) },
			    { path: 'ventas', loadComponent: () => import('./modules/instituto/submodules/ventas.component').then(m => m.VentasComponent) }
			  ]
			},
			{ path: 'automated',
			  loadComponent: () => import('./modules/automated/automated.component').then(m => m.AutomatedComponent),
			  children: [
			    { path: 'gest-proyectos', loadComponent: () => import('./modules/automated/submodules/gest-proyectos.component').then(m => m.GestProyectosComponent) },
			    // { path: 'gest-pedidos', loadComponent: () => import('./modules/automated/submodules/gest-pedidos.component').then(m => m.GestPedidosComponent) },
			    // { path: 'ingenieria', loadComponent: () => import('./modules/automated/submodules/ingenieria.component').then(m => m.IngenieriaComponent) },
			    // { path: 'finanzas', loadComponent: () => import('./modules/automated/submodules/finanzas.component').then(m => m.FinanzasComponent) },
			    // { path: 'compras', loadComponent: () => import('./modules/automated/submodules/compras.component').then(m => m.ComprasComponent) },
			    // { path: 'capital-humano', loadComponent: () => import('./modules/automated/submodules/capital-humano.component').then(m => m.CapitalHumanoComponent) },
			    // { path: 'recursos-materiales', loadComponent: () => import('./modules/automated/submodules/recursos-materiales.component').then(m => m.RecursosMaterialesComponent) },
			    // { path: 'ventas', loadComponent: () => import('./modules/automated/submodules/ventas.component').then(m => m.VentasComponent) },
			    // { path: 'post-ventas', loadComponent: () => import('./modules/automated/submodules/post-ventas.component').then(m => m.PostVentasComponent) }
			  ]
			},
			{ path: 'seati', loadComponent: () => import('./modules/seati/seati.component').then(m => m.SeatiComponent) },
			{ path: '', redirectTo: 'home', pathMatch: 'full' },
		]
	}
];
