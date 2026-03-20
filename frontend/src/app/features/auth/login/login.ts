import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CyberBackgroundComponent } from '../../../shared/components/cyber-background/cyber-background';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CyberBackgroundComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private authService: AuthService) { }

  login() {
    console.log(this.email, this.password)

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        // inject the Router and navigate to a dashboard here
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }

}
