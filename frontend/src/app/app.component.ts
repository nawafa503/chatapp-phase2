import { Component, OnInit } from '@angular/core';
import {RouterOutlet, RouterLink, Router} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,CommonModule],  // Import RouterLink in the standalone component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent implements OnInit{
  title = 'frontend';
  user:any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Logout method
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);  // Redirect to login page
  }

}
