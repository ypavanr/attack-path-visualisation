import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  register() {
    // Add your registration logic here
    console.log('Registration submitted', this.adminemail, this.adminpassword, this.fullname, this.username, this.email, this.assignedpassword, this.role);
  }
}
