import { group } from '@angular/animations';
import {
  Component,
  NgModule,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { GroupService } from '../services/group.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateUserComponent } from '../create-user/create-user.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true,
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreateUserComponent,
  ],
  providers: [GroupService],
})
export class AdminDashboardComponent implements OnInit {
  addUserForm!: FormGroup;
  addUserChannelForm!: FormGroup;
  removeUserChannelForm!: FormGroup;
  removeUserForm!: FormGroup;
  groupName: string = '';
  channelName: string = '';
  selectedGroupId: number = 0;
  groups: any[] = [];
  groupUsers: any[] = [];
  groupChannels: any[] = [];
  channelUsers: any[] = [];
  // successMessage: string = '';
  // errorMessage: string = '';
  users: any[] = [];
  user:any

  constructor(private fb: FormBuilder, private groupService: GroupService, private toastr: ToastrService) {
    this.addUserForm = this.fb.group({
      groupId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      userName: [''],
    });
    this.addUserChannelForm = this.fb.group({
      groupId: ['', [Validators.required]],
      channelId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
    });
    this.removeUserChannelForm = this.fb.group({
      groupId: ['', [Validators.required]],
      channelId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
    });
    this.removeUserForm = this.fb.group({
      groupId: ['', [Validators.required]],
      userId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string);

    this.loadGroups();
    if (this.user.roles && this.user.roles.includes('superadmin')) {
      this.getUsers();
    }
    this.subscribeRemoveUser();
    this.subscribeAddUserChannelForm();
  }

  subscribeAddUserChannelForm(){
    this.addUserChannelForm.get('groupId')?.valueChanges.subscribe((res)=>{
      if (res) {
        this.getGroupChannels(res);
        this.getGroupUsers(res);
      }
    })
    this.removeUserChannelForm.get('groupId')?.valueChanges.subscribe((res)=>{
      if (res) {
        this.getGroupChannels(res);
      }
    })
    this.removeUserChannelForm.get('channelId')?.valueChanges.subscribe((res)=>{
      if (res) {
        this.getChannelUsers(res);
      }
    })
  }

  subscribeRemoveUser(){
    this.removeUserForm.get('groupId')?.valueChanges.subscribe((res)=>{
      if (res) {
        this.getGroupUsers(res);
      }
    })
  }

  onUserSelect(event: Event): void {
    const selectedUserId = (event.target as HTMLSelectElement).value;
    const selectedUser = this.users.find((user) => user._id === selectedUserId);
    if (selectedUser) {
      this.addUserForm.patchValue({
        userName: selectedUser.username, // Set the username field in the form
      });
    } else {
      this.addUserForm.patchValue({
        userName: '', // Clear the username if no user is found
      });
    }
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (response) => {
        // Log the response to check its structure
        console.log(response);

        this.groups = response.groups; // Extract the groups array
      },
      error: (error) => {
        this.toastr.error('Failed to load groups');
      },
    });
  }

  createGroup() {
    console.log(this.groupName);
    console.log(this.groups);

    this.groupService.createGroup(this.groupName).subscribe((group) => {
      this.groups.push(group);
      this.groupName = '';
      this.toastr.success('Group created succesfully');
    },(err)=>{
      this.toastr.error(err.error.message);
    });
  }

  createChannel() {
    console.log(this.selectedGroupId);
    console.log(this.channelName);
    this.groupService
      .createChannel(this.selectedGroupId, this.channelName)
      .subscribe((channel) => {
        const group = this.groups.find((g) => g._id == this.selectedGroupId);
        console.log(group);

        group.channels.push(channel.channel);
        this.channelName = '';
        this.toastr.success('Channel created succesfully');
      }, (err)=>{
        this.toastr.error(err.error.message);
      });
  }

  getUsers(): void {
    this.groupService.getUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.users = data;
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }

  addUser() {
    if (this.addUserForm.valid) {
      this.getUsers();
      
      const selectedUser = this.users.find(
        (user) => user._id === this.addUserForm.value.userId
      );
      console.log(selectedUser._id);
      this.addUserForm.patchValue({
        userName: selectedUser.username, // Set the username field in the form
      });
      console.log(this.addUserForm.value);
      const { groupId, userId, userName } = this.addUserForm.value;

      this.groupService.addUserToGroup(groupId, userId, userName).subscribe({
        next: () => {
          this.toastr.success("User added successfully");
          this.addUserForm.reset();
        },
        error: (err) => {
          console.error('Error adding user:', err);
          this.toastr.error(err.error.message);
          // this.errorMessage = 'Error adding user';
        },
      });
    }
  }

  getGroupUsers(groupId:string){
    this.groupService.getGroupUsers(groupId).subscribe((res)=>{
      this.groupUsers = res.users;
      console.log(res);
      
    }, (err)=>{
      this.toastr.error(err.error.message);
    })
  }

  removeUser() {
    if (this.removeUserForm.valid) {
      console.log(this.removeUserForm.value);
      const { groupId, userId } = this.removeUserForm.value;

      this.groupService.removeUserFromGroup(groupId, userId).subscribe({
        next: () => {
          this.toastr.success("User removed successfully");
          this.removeUserForm.reset();
          this.groupUsers = [];
        },
        error: (err) => {
          console.error('Error removing user:', err);
          this.toastr.error(err.error.message);
        },
      });
    }
  }

  getChannelUsers(channelId:string){
    const { groupId } = this.removeUserChannelForm.value;
    this.groupService.getChannelUsers(groupId, channelId).subscribe((res)=>{
      this.channelUsers = res.users;
    }, (err)=>{
      this.toastr.error(err.error.message);
    })
  }

  getGroupChannels(groupId:string){
    this.groupService.getGroupChannels(groupId).subscribe((res)=>{
      this.groupChannels = res.channels;
    }, (err)=>{
      this.toastr.error(err.error.message);
    })
  }

  addUserToChannel() {
    if (this.addUserChannelForm.valid) {
      const { groupId, userId, channelId } = this.addUserChannelForm.value;

      this.groupService.addUserToChannel(groupId, userId, channelId).subscribe({
        next: () => {
          this.toastr.success("User added successfully");
          this.addUserChannelForm.reset();
        },
        error: (err) => {
          console.error('Error adding user:', err);
          this.toastr.error(err.error.message);
          // this.errorMessage = 'Error adding user';
        },
      });
    }else{
      this.toastr.error('Invalid form values');
    }
  }

  removeUserFromChannel() {
    if (this.removeUserChannelForm.valid) {
      const { groupId, userId, channelId } = this.removeUserChannelForm.value;

      this.groupService.removeUserFromChannel(groupId, userId, channelId).subscribe({
        next: () => {
          this.toastr.success("User removed successfully");
          this.removeUserChannelForm.reset();
        },
        error: (err) => {
          console.error('Error removing user:', err);
          this.toastr.error(err.error.message);
          // this.errorMessage = 'Error adding user';
        },
      });
    }else{
      this.toastr.error('Invalid form values');
    }
  }
}
