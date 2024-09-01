import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [],
  template: '',
})
export class OAuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      var code = params['code'];
      if (code) {
        this.authService.handleAuthCallback(code).subscribe(()=> {
          this.router.navigate(['/dashboard']);
        });
      }
      else {
        this.router.navigate(['']);
      }
    });
  }

}
