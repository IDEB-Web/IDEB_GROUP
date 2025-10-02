import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token = '';
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.authService.resetPassword(
      this.form.value.email,
      this.form.value.password,
      this.form.value.password_confirmation, // envía el campo exacto
      this.token
    ).subscribe({
      next: (res: any) => {
        this.message = res.message;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err: any) => this.message = err.error?.email || 'Error al resetear contraseña'
    });
  }
}
