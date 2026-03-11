import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(email: string, password: string) {

    console.log("Logging in:", email)

    // later call backend API
  }

}