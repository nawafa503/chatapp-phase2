import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { routes } from '../app.routes';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  // successMessage = '';
  // errorMessage = '';
  avatarFile: File | null = null;
  avatarPreview: any = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private sanitizer: DomSanitizer, private toastr: ToastrService) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.registerForm.value;
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.avatarFile = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.submitted = true;

    // Stop if form is invalid
    if (this.registerForm.invalid || !this.avatarFile) {
      this.toastr.error('Invalid form values')
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerForm.get('username')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    formData.append('avatar', this.avatarFile);

    // Create a new user using the AuthService
    this.authService
      .createUser(formData)
      .subscribe({
        next: (response) => {
          this.toastr.success('User created successfully!');
          // this.errorMessage = '';
          this.registerForm.reset();
          this.submitted = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastr.error(error.error.message);
          // this.successMessage = '';
        }
      });
  }
}
