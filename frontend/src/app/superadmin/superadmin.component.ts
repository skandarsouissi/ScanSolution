import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers(); // Recharge la liste des utilisateurs après suppression
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Erreur lors de la suppression de l\'utilisateur';
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Utilisateurs récupérés:', users); // 👀 Debug
        this.users = users; // Contient id, username et role
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }
}
