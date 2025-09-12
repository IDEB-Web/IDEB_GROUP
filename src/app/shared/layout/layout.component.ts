import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FooterComponent],
})
export class LayoutComponent implements OnInit {
  menuOpen = false;
  loginModalOpen = false;
  isHomeView = true;
  showInstitutoBtns = false;
  loginForm: FormGroup;
  loginError: string | null = null;

  currentUser: any = null; // 👈 Usuario logueado

  constructor(
    public router: Router,
    private fb: FormBuilder,
    public authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    // Recuperar usuario si ya estaba en localStorage
    this.currentUser = this.authService.getUser();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomeView = event.urlAfterRedirects === '/home' || event.urlAfterRedirects === '/';
      });
  }

  openLoginModal() {
    this.loginModalOpen = true;
  }

  closeLoginModal() {
    this.loginModalOpen = false;
    this.loginForm.reset();
    this.loginError = null;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginError = 'Por favor, introduce un correo y contraseña válidos.';
      return;
    }
    this.loginError = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login exitoso!', response);
        this.currentUser = response.user; // 👈 Guardar usuario
        this.closeLoginModal();
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.loginError = err.error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        console.error('Error de login:', err);
      },
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/home']);
  }

  navigateTo(view: string) {
    switch (view) {
      case 'instituto':
        this.router.navigate(['/instituto']);
        break;
      case 'automated':
        this.router.navigate(['/automated']);
        break;
      case 'seati':
        this.router.navigate(['/seati']);
        break;
      case 'home':
        this.router.navigate(['/home']);
        break;
    }
    this.closeMenu();
  }

  getHeaderTitle(): string {
    const url = this.router.url;
    const titleMap: { [key: string]: string } = {
      '/instituto': 'INSTITUTO IDEB ERP',
      '/automated': 'I-DEB ERP',
      '/seati': 'SEATI ERP',
    };

    for (const key of Object.keys(titleMap)) {
      if (url.startsWith(key)) {
        return titleMap[key];
      }
    }

    return 'I-DEB GROUP ERP';
  }

  showMainHeader(): boolean {
    return true;
  }
}
