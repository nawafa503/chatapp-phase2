import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true, // Mark this component as standalone
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [],
  imports: [ReactiveFormsModule],
})
export class AuthComponent {
  register() {
    this.router.navigate(['/register']);
  }
  loginForm: FormGroup;
  // errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      console.log('Invalid form');

      return;
    }

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log(response);
        // Assuming the backend returns a token, store it in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
        this.toastr.success('Logged in successfully')
      },
      error: (err) => {
        this.toastr.error(err.error.message)
      },
    });
  }
}
