import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  //check if the user is super admin before going to the admin page
  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.authService.isAuthenticated() && user.roles && (user.roles.includes('superadmin') || user.roles.includes('groupadmin'))) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
