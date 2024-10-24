import { group } from '@angular/animations';
import { Component, NgModule, OnInit } from '@angular/core';
import { GroupService } from '../services/group.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [GroupService],
})
export class DashboardComponent implements OnInit {
  groups: any[] = [];
  user:any;

  constructor(private groupService: GroupService, public router:Router, private toastr:ToastrService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string);
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (response) => {
        console.log(response);
        if (this.user.roles && this.user.roles.includes('user')) {
          // Filter out only the channels where the user is explicitly assigned
          this.groups = response.groups.map((group:any) => {
            const userChannels = group.channels.filter((channel:any) =>{
              const a = channel.users.includes(this.user._id);
              return a;
            });
            return { ...group, channels: userChannels };
          });
        }else{
          this.groups = response.groups;
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        console.error('Failed to load groups', error);
      },
    });
  }

  goToChat(group_id:string, channel_id:string, name:string){
    this.router.navigate(['chat'], {queryParams:{group_id, channel_id,name}})
  }
}
