import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/models';
import { errorMessage } from '../../core/api';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  auth = inject(AuthService);

  users = signal<User[]>([]);
  search = signal('');
  error = signal('');
  message = signal('');

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.users().filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.userService.getAll().subscribe({
      next: (u) => this.users.set(u),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  remove(u: User) {
    if (!confirm(`Delete user ${u.email}?`)) return;
    this.userService.delete(u.id).subscribe({
      next: () => {
        this.message.set(`User ${u.email} deleted`);
        setTimeout(() => this.message.set(''), 3000);
        this.load();
      },
      error: (err) => this.error.set(errorMessage(err)),
    });
  }
}
