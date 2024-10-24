import { group } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GroupService } from '../services/group.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  @Output() userCreated: EventEmitter<boolean> = new EventEmitter();
  createUserForm!: FormGroup;
  selectedGroupId: number = 0;
  roles : string[] = ['user', 'groupadmin', 'superadmin'];
  avatarFile: File | null = null;
  avatarPreview: any = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private toastr: ToastrService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    console.log(this.roles);

    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', Validators.required],
    });
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

  createUser() {
    if (this.createUserForm.valid && this.avatarFile) {
      const { username, email, password, role } = this.createUserForm.value;
      const formData = new FormData
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('avatar', this.avatarFile);
      this.auth.createUser(formData).subscribe({
        next: () => {
          this.toastr.success('User created successfully');
          this.createUserForm.reset();
          this.userCreated.emit(true);
        },
        error: (err) => {
          this.toastr.error('Failed to create user');
        },
      });
    }else{
      this.toastr.error('Invalid form values')
    }
  }
}
