import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common'; 
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { ProfileModalComponent } from '../../modules/perfil/profile-modal.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FooterComponent, ProfileModalComponent],
})
export class LayoutComponent implements OnInit {
  menuOpen = false;
  loginModalOpen = false;
  isHomeView = true;
  loginForm: FormGroup;
  loginError: string | null = null;

  // Referencia al input de archivo para el logo
  @ViewChild('logoInput') logoInput!: ElementRef<HTMLInputElement>;

  currentUser: any = null; 
  settingsOpen = false;    

  constructor(
    public router: Router,
    private fb: FormBuilder,
    public authService: AuthService,
    private location: Location
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

showBackButton(): boolean {
  return this.router.url !== '/' && this.router.url !== '/home';
}

goBack(): void {
  this.location.back();
}

  ngOnInit() {
    this.currentUser = this.authService.getUser();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomeView = event.urlAfterRedirects === '/home' || event.urlAfterRedirects === '/';
      });

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.authService.googleSignIn(token).subscribe({
        next: (response: any) => {
          this.currentUser = response.user;
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
  console.error('Error al iniciar sesión con Google:', err);
}

      });
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  openLoginModal() { this.loginModalOpen = true; }
  closeLoginModal() {
    this.loginModalOpen = false;
    this.loginForm.reset();
    this.loginError = null;
  }

  showProfileModal = false;

  openProfileModal() {
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  /**
   * Dispara el click del input de archivo oculto para cambiar el logo.
   * Solo para administradores.
   */
  triggerLogoUpload(event: Event) {
    event.preventDefault(); // Evita que el enlace '#' navegue
    this.logoInput.nativeElement.click();
    this.settingsOpen = false; // Cierra el menú de configuraciones
  }

  /**
   * Se ejecuta cuando el admin selecciona un nuevo archivo de logo.
   */
  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // --- Lógica de Subida (Simulada) ---
      // En una aplicación real, aquí llamarías a un servicio para subir
      // el archivo al backend y obtener la nueva URL.
      // Ejemplo: this.configService.uploadLogo(file).subscribe(response => { ... });

      // Para esta demostración, usamos FileReader para obtener una URL local (base64)
      // y la guardamos en localStorage para persistir el cambio en el navegador.
      const reader = new FileReader();
      reader.onload = (e: any) => {
        localStorage.setItem('customLogoUrl', e.target.result);
        alert('Logo actualizado. El cambio será visible al recargar la página.');
      };
      reader.readAsDataURL(file);
    }
  }
  
  login() {
    if (this.loginForm.invalid) {
      this.loginError = 'Por favor, introduce un correo y contraseña válidos.';
      return;
    }
    this.loginError = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.currentUser = response.user;
        this.closeLoginModal();
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.loginError = err.error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        console.error('Error de login:', err);
      },
    });
  }

 
  userDropdownOpen = false;

  // Toggle del dropdown del usuario
  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  // Login con Google
  loginWithGoogle() {
    
    window.location.href = environment.apiUrl + '/auth/google';
  }

  // Logout
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.currentUser = null;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en el logout del servidor, cerrando sesión localmente:', err);
        this.authService.logout(); 
      }
    });
  }

  // Navegación principal
  navigateTo(view: string) {
    const protectedViews = ['instituto', 'automated', 'seati'];

    if (protectedViews.includes(view) && !this.authService.isAuthenticated()) {
      // Si la vista es protegida y el usuario no está autenticado, abre el modal de login.
      this.loginError = 'Debes iniciar sesión para acceder a esta sección.';
      this.openLoginModal();
    } else {
      // Si la vista no es protegida o el usuario sí está autenticado, navega.
      switch (view) {
        case 'instituto': this.router.navigate(['/instituto']); break;
        case 'automated': this.router.navigate(['/automated']); break;
        case 'seati': this.router.navigate(['/seati']); break;
        case 'home': this.router.navigate(['/home']); break;
      }
    }
    this.closeMenu();
  }

  // Header title dinámico
  getHeaderTitle(): string {
    const url = this.router.url;
    const titleMap: { [key: string]: string } = {
      '/instituto': 'INSTITUTO IDEB ERP',
      '/automated': 'I-DEB ERP',
      '/seati': 'SEATI ERP',
    };
    for (const key of Object.keys(titleMap)) {
      if (url.startsWith(key)) return titleMap[key];
    }
    return 'I-DEB GROUP ERP';
  }

  // Devuelve la URL del logo según la ruta actual
  getLogoUrl(): string {
    // 1. Revisa si existe un logo personalizado guardado por el admin.
    const customLogo = localStorage.getItem('customLogoUrl');
    if (customLogo) {
      return customLogo;
    }

    // 2. Si no hay logo personalizado, usa la lógica original basada en la ruta.
    const url = this.router.url;

    if (url.startsWith('/instituto')) {
      return 'assets/LOGO_IDEB.png';
    }
    if (url.startsWith('/automated')) {
      return 'assets/IDEB2.png';
    }
    if (url.startsWith('/seati')) {
      return 'assets/LOGO_IDEB.png';
    }
    return 'assets/LOGO_IDEB.png';
  }
  
  // Mostrar header siempre
  showMainHeader(): boolean { return true; }

  // Menú principal
  closeMenu() { this.menuOpen = false; }

  // Dropdown de configuraciones
  toggleSettingsMenu(event: Event) {
    event.stopPropagation();
    this.settingsOpen = !this.settingsOpen;
  }

  // Cerrar dropdowns al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.settingsOpen) this.settingsOpen = false;
    if (this.menuOpen) this.menuOpen = false;
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
