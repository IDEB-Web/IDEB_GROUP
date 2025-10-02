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
  toggleTheme(event: Event) {
    event.preventDefault();
    this.authService.toggleDarkMode();
  }
  changeFontSize(size: 'small' | 'medium' | 'large' | 'xlarge', event?: Event) {
    if(event) event.preventDefault(); 
    document.body.setAttribute('data-font-size', size);
    // Actualiza la variable CSS global para que todo lo que use --font-size-base cambie
    let px = '16px';
    if (size === 'small') px = '14px';
    if (size === 'medium') px = '18px';
    if (size === 'large') px = '22px';
    if (size === 'xlarge') px = '28px';
    document.documentElement.style.setProperty('--font-size-base', px);
    localStorage.setItem('font-size', size);
  }




  ngOnInit() {
    // Cargar usuario si ya está logueado
    this.currentUser = this.authService.getUser();

    // Detectar cambios de ruta para mostrar si estamos en Home
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isHomeView = event.urlAfterRedirects === '/home' || event.urlAfterRedirects === '/';
      });
      const savedSize = localStorage.getItem('font-size');
      if (savedSize) {
        document.body.setAttribute('data-font-size', savedSize);
        let px = '16px';
        if (savedSize === 'small') px = '14px';
        if (savedSize === 'medium') px = '18px';
        if (savedSize === 'large') px = '22px';
        if (savedSize === 'xlarge') px = '28px';
        document.documentElement.style.setProperty('--font-size-base', px);
      }


    // Manejar callback de login con Google
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const path = this.router.url.split('?')[0];

    // SOLO procesar token si estamos en la ruta de Google callback
    if (token && path === '/auth/callback') {
      this.authService.googleSignIn(token).subscribe({
        next: (response) => {
          if (response && response.access_token) {
            this.currentUser = this.authService.getUser();
            this.router.navigate(['/home'], { replaceUrl: true });
          } else if (response?.status === 'pendiente') {
            alert(response.message || 'Cuenta pendiente de aprobación.');
            this.router.navigate(['/home'], { replaceUrl: true });
          }
        },
        error: (err) => {
          console.error('Error procesando el token de Google:', err.error?.message || err);
          this.router.navigate(['/auth/error'], { replaceUrl: true });
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

  openProfileModal() { this.showProfileModal = true; }
  closeProfileModal() { this.showProfileModal = false; }

  triggerLogoUpload(event: Event) {
    event.preventDefault();
    this.logoInput.nativeElement.click();
    this.settingsOpen = false;
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
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
  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  loginWithGoogle() {
    window.location.href = environment.apiUrl + '/auth/google';
  }

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

  navigateTo(view: string) {
    const protectedViews = ['instituto', 'automated', 'seati'];

    if (protectedViews.includes(view) && !this.authService.isAuthenticated()) {
      this.loginError = 'Debes iniciar sesión para acceder a esta sección.';
      this.openLoginModal();
    } else {
      switch (view) {
        case 'instituto': this.router.navigate(['/instituto']); break;
        case 'automated': this.router.navigate(['/automated']); break;
        case 'seati': this.router.navigate(['/seati']); break;
        case 'home': this.router.navigate(['/home']); break;
      }
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
      if (url.startsWith(key)) return titleMap[key];
    }
    return 'I-DEB GROUP ERP';
  }

  getLogoUrl(): string {
    const customLogo = localStorage.getItem('customLogoUrl');
    if (customLogo) return customLogo;

    const url = this.router.url;
    if (url.startsWith('/instituto')) return 'assets/LOGO_IDEB.png';
    if (url.startsWith('/automated')) return 'assets/IDEB2.png';
    if (url.startsWith('/seati')) return 'assets/LOGO_IDEB.png';
    return 'assets/LOGO_IDEB.png';
  }

  showMainHeader(): boolean { return true; }
  closeMenu() { this.menuOpen = false; }

  toggleSettingsMenu(event: Event) {
    event.stopPropagation();
    this.settingsOpen = !this.settingsOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.settingsOpen) this.settingsOpen = false;
    if (this.menuOpen) this.menuOpen = false;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }


  getUserRoleLabel(): string {
    if (!this.currentUser?.role || this.currentUser.role === 'user') {
      return 'Empleado';
    }
    return this.currentUser.role;
  }
  // Accesibilidad
  accessibilityOpen = false;
  highContrast = false;
  reduceMotion = false;
  easyRead = false;

  toggleAccessibilityMenu(event: Event) {
    event.stopPropagation();
    this.accessibilityOpen = !this.accessibilityOpen;
  }

  // Aplicar accesibilidad
  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    document.body.classList.toggle('high-contrast', this.highContrast);
  }

  toggleReduceMotion() {
    this.reduceMotion = !this.reduceMotion;
    document.body.classList.toggle('reduce-motion', this.reduceMotion);
  }

  toggleEasyRead() {
    this.easyRead = !this.easyRead;
    document.body.classList.toggle('easy-read', this.easyRead);
  }

}

