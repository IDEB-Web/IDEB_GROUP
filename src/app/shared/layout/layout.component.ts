import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Asegúrate de que este servicio exista

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

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
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

    // Llama al servicio de autenticación para comunicarse con el backend de Laravel
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login exitoso!', response);
        // Guardar el token para mantener la sesión
        localStorage.setItem('authToken', response.access_token);
        // Opcional: guardar información del usuario
        // localStorage.setItem('user', JSON.stringify(response.user));
        this.closeLoginModal();
        this.router.navigate(['/home']); // O redirigir a un dashboard
      },
      error: (err: any) => {
        this.loginError = err.error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        console.error('Error de login:', err);
      },
    });
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
