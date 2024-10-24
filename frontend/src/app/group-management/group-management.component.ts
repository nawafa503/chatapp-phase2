import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.css'
})
export class GroupManagementComponent implements OnInit {
  groupForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private groupService: GroupService) {
    this.groupForm = this.formBuilder.group({
      groupName: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getGrups();
  }

  getGrups() {
    this.groupService.getGroups().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Failed to load groups', error);
      },
    })
  }
  createGroup() {
    if (this.groupForm.invalid) {
      return;
    }

    const { groupName } = this.groupForm.value;
    this.groupService.createGroup(groupName).subscribe({
      next: () => {
        console.log('Group created successfully');
        this.groupForm.reset();
      },
      error: (error) => {
        console.error('Failed to create group', error);
      },
    });
  }
}
