import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component ({
  selector: 'app-logout',
  standalone: true,
  imports: [MatButtonModule],
  template: `
      <button mat-raised-button (click)="logout()">Logout</button>
  `,
})
export class LogoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
