import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CyberBackgroundComponent } from '../../../shared/components/cyber-background/cyber-background';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CyberBackgroundComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  adminemail = '';
  adminpassword = '';
  fullname = '';
  username = '';
  email = '';
  assignedpassword = '';
  role = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register({
      adminemail: this.adminemail,
      adminpassword: this.adminpassword,
      full_name: this.fullname,
      username: this.username,
      email: this.email,
      password: this.assignedpassword, 
      role: this.role
    }).subscribe({
      next: (res: any) => {
        console.log('User created successfully!', res);
        alert('User registered successfully');
      },
      error: (err: any) => {
        console.error('Failed to create user:', err);
        if (err.status === 401 || err.status === 403) {
           alert('Access Denied: You must be an Admin to register users!');
        } else {
           alert('Registration failed. Check console for details.');
        }
      }
    });
  }
}
