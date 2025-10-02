import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-approval.component.html',
  styleUrls: ['./user-approval.component.css']
})
export class UserApprovalComponent implements OnInit {
  pendingUsers: User[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.authService.getPendingUsers().subscribe({
      next: (users: User[]) => {
        this.pendingUsers = users;
      },
      error: (err: any) => {
        console.error('Error loading pending users', err);
        this.showMessage('Error al cargar los usuarios pendientes.', 'error');
      }
    });
  }

  approveUser(id: number): void {
    this.authService.approveUser(id).subscribe({
      next: () => {
        this.showMessage('Usuario aprobado correctamente.', 'success');
        this.loadPendingUsers();
      },
      error: (err) => {
        console.error('Error approving user', err);
        this.showMessage('Error al aprobar el usuario.', 'error');
      }
    });
  }

  rejectUser(id: number): void {
    this.authService.rejectUser(id).subscribe({
      next: () => {
        this.showMessage('Usuario rechazado correctamente.', 'success');
        this.loadPendingUsers();
      },
      error: (err) => {
        console.error('Error rejecting user', err);
        this.showMessage('Error al rechazar el usuario.', 'error');
      }
    });
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 3000);
  }
}