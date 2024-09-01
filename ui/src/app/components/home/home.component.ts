import { Component, OnInit } from '@angular/core';
import { LoginComponent } from "../auth/login/login.component";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
     if(this.authService.isLoggedIn()) {
        this.router.navigate(['dashboard']);
     }
  }

}
