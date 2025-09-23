import { 
  Component, Input, Output, EventEmitter, 
  OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef 
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css'],
})
export class ProfileModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isOpen = false;
  @Input() user!: User & { photoUrl?: string }; // photoUrl opcional
  @Output() closeModalEvent = new EventEmitter<void>();

  @ViewChild('googleBtnContainer', { static: false }) googleBtnContainer!: ElementRef;

  private GOOGLE_CLIENT_ID = '157090531382-5pfq4ml8sca4aq4vfoodpi0t625gaee3.apps.googleusercontent.com';

  private googleScriptElement: HTMLScriptElement | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // aquí no se inicializa el botón todavía porque el ViewChild no existe
  }

  ngAfterViewInit(): void {
    this.loadGoogleScript().then(() => {
      this.initGoogleButton();
    }).catch(err => {
      console.error('No se pudo cargar el script de Google Identity Services', err);
    });
  }

  ngOnDestroy(): void {
    if (this.googleScriptElement && this.googleScriptElement.parentNode) {
      this.googleScriptElement.parentNode.removeChild(this.googleScriptElement);
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.accounts) {
        resolve();
        return;
      }

      this.googleScriptElement = document.createElement('script');
      this.googleScriptElement.src = 'https://accounts.google.com/gsi/client';
      this.googleScriptElement.async = true;
      this.googleScriptElement.defer = true;
      this.googleScriptElement.onload = () => resolve();
      this.googleScriptElement.onerror = (err) => reject(err);
      document.head.appendChild(this.googleScriptElement);
    });
  }

  private initGoogleButton(): void {
    const g = (window as any).google;
    if (!g || !g.accounts || !g.accounts.id) {
      console.error('Google Identity Services no está disponible');
      return;
    }

    g.accounts.id.initialize({
      client_id: this.GOOGLE_CLIENT_ID,
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    try {
      if (this.googleBtnContainer) {
        g.accounts.id.renderButton(this.googleBtnContainer.nativeElement, {
          theme: 'outline',
          size: 'large',
          width: '260'
        });
      } else {
        console.warn('googleBtnContainer aún no está disponible');
      }
    } catch (err) {
      console.error('Error al renderizar botón Google', err);
    }
  }

  private handleCredentialResponse(response: any): void {
    if (!response || !response.credential) {
      alert('No se obtuvo el token de Google');
      return;
    }

    const idToken = response.credential;

    this.authService.googleSignIn(idToken).subscribe({
      next: (res) => {
        if (res && res.access_token) {
          this.closeModal();
        } else if (res && res.status === 'pendiente') {
          alert(res.message || 'Cuenta creada. Pendiente de aprobación por el admin.');
        } else if (res && res.message) {
          alert(res.message);
        }
      },
      error: (err) => {
        const msg = err?.error?.message || 'Error al iniciar sesión con Google';
        alert(msg);
      }
    });
  }
}


