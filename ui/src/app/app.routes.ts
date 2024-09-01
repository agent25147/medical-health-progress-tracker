import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { OAuthCallbackComponent } from './components/auth/oauth-callback/oauth-callback.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'auth/google/callback', component: OAuthCallbackComponent },
];
