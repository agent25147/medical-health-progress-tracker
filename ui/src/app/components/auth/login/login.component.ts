import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/auth/google';
  }
}
