import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  standalone: true,
  styleUrls: ['./chat-room.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbTooltipModule],
  providers: [ChatService]
})



export class ChatRoomComponent implements OnInit {
  baseUrl = 'http://localhost:3000/';
  newMessage = new FormControl();
  groupId: string = '';
  channelId: string = '';
  user:any;

  channelName: string = 'General Channel';
  participantsCount: number = 0;

  messages :any[] = [];


  constructor(private chatService: ChatService, private route: ActivatedRoute, private router: Router, private toastr:ToastrService, private cdref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string);
    this.route.queryParams.subscribe(params => {
      this.groupId = params['group_id'] || null;
      this.channelId = params['channel_id'] || null;
      this.channelName = params['name'] || null;

      if (!this.channelId || !this.channelId || !this.channelName) {
        this.toastr.error('Invalid params')
        this.router.navigate(['/dashboard']);
      }

      this.joinChannel();
      this.getUserCount();
      this.getPreviousMessages();
      this.getMessages();
    });
  }

  getPreviousMessages(){
    this.chatService.getPreviousMessages().subscribe((res)=>{
      this.messages = res;
      console.log(res, 'messages');
    },(err)=>{
      this.toastr.error(err.error.message);
    });
  }

  getMessages(){
    this.chatService.getMessages().subscribe((res)=>{
      this.messages = res;
      console.log(res, 'messages');
    },(err)=>{
      this.toastr.error(err.error.message);
    });
  }

  joinChannel(){
    this.chatService.joinChannel(this.user._id, this.channelId, this.groupId);
  }

  sendMessage() {
    if (this.newMessage.value) {
      this.chatService.sendMessage(this.channelId, this.newMessage.value, this.user._id)
      this.newMessage.setValue('');
      this.cdref.detectChanges();
    }
  }

  getUserCount(){
    this.chatService.getUserCount().subscribe(res=>{
      this.participantsCount = res;
      console.log(res);
    });
    
  }

  leaveChannel(){
    this.chatService.leaveChannel(this.channelId);
      this.router.navigate(['/dashboard']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageData = e.target.result;
        this.chatService.sendMessage(this.channelId, imageData, this.user._id, 'image')
      };
      reader.readAsDataURL(selectedImage);
    }
  }
}
