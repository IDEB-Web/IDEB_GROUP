import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  fotoPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      telefono: [''],
      idioma: ['es'],
      zonaHoraria: ['GMT-6'],
      foto: ['']
    });
  }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.perfilForm.patchValue({
        nombre: user.name,
        email: user.email,
        telefono: user.telefono || '',
        idioma: user.idioma || 'es',
        zonaHoraria: user.zonaHoraria || 'GMT-6',
        foto: user.foto || ''
      });
      if (user.foto) this.fotoPreview = user.foto;
    }
  }

  onFotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result;
        this.perfilForm.patchValue({ foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCambios() {
    if (this.perfilForm.valid) {
      const data = this.perfilForm.getRawValue();

      // Mapear nombre
      data.name = data.nombre;
      delete data.nombre;

      // agregar foto si existe
      if (this.fotoPreview) {
        data.foto = this.fotoPreview;
      }

      this.authService.updateProfile(data).subscribe({
        next: (res) => {
          alert('Perfil actualizado correctamente 🚀');
          console.log('Respuesta backend:', res);
        },
        error: (err) => {
          console.error('Error al actualizar perfil:', err);
          alert('Error al guardar el perfil ❌');
        }
      });
    }
  }
}
