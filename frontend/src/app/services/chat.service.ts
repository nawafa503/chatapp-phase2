import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: Socket) {}

  joinChannel(userId: string, channelId: string, groupId: string) {
    return this.socket.emit('joinChannel', { userId, channelId, groupId });
  }

  sendMessage(channelId: string, message: string, senderId: string, type:string = 'text') {
    return this.socket.emit('message', { channelId, message, senderId, type });
  }

  getPreviousMessages(): Observable<any> {
    return this.socket.fromEvent('previousMessages');
  }

  getMessages(): Observable<any> {
    return this.socket.fromEvent('message');
  }

  getUserCount(): Observable<number> {
    return this.socket.fromEvent('updateUserCount');
  }

  leaveChannel(channelId: string): void {
    return this.socket.emit('leaveChannel', channelId);
  }
}
