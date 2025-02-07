import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddUserComponent } from '../add-user/add-user.component';
import { EmptyListComponent } from '../empty-list/empty-list.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user.service';
import { ServerOfflineComponent } from '../server-offline/server-offline.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [
    AddUserComponent,
    EmptyListComponent,
    CommonModule,
    ServerOfflineComponent,
    LoadingComponent,
  ],
})
export class DataTableComponent implements OnInit {
  users: any[] = [];
  error: string | null = null;
  selectedUser: any = null;
  isLoading: boolean = false;
  loadingDelay: number = 500;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        setTimeout(() => {
          this.isLoading = false;
        }, this.loadingDelay);
      },

      (error) => {
        this.isLoading = true;
        console.error('Error fetching users:', error);
        this.error = 'Error fetching users. Please try again later.';
        setTimeout(() => {
          this.isLoading = false;
        }, this.loadingDelay);
      }
    );
  }

  handleEditClick(user: any): void {
    this.selectedUser = user;
  }

  handleDeleteClick(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter((user) => user.id !== userId);
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  handleViewClick(userId: number): void {
    this.router.navigate(['/user', userId]);
  }

  handleUserUpdated(): void {
    this.selectedUser = null;
    this.fetchUsers();
  }
}
