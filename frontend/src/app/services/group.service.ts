import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private baseUrl = 'http://localhost:3000';  // Specify the backend API URL with the port

  getGroups(): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    return this.http.get<any>(`${this.baseUrl}/group/getGroups`, { headers });
  }

  getGroupUsers(groupId:string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    const params = {groupId}
    return this.http.get<any>(`${this.baseUrl}/group/getGroupUsers`, { params, headers });
  }
  
  getChannelUsers(groupId:string, channelId:string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    const params = {groupId, channelId}
    return this.http.get<any>(`${this.baseUrl}/channel/users`, { params, headers });
  }

  getGroupChannels(groupId:string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    const params = {groupId}
    return this.http.get<any>(`${this.baseUrl}/group/channels`, { params, headers });
  }

  createGroup(groupName: string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    return this.http.post(`${this.baseUrl}/group/createGroup`, { groupName }, { headers });
  }

  createChannel(groupId: number, channelName: string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    return this.http.post(`${this.baseUrl}/group/addChannel`, { groupId, channelName }, { headers });
  }

  addUserToGroup(groupId: number, userId: number, userName: string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    const body = { groupId, userId, userName };
    return this.http.post(`${this.baseUrl}/group/addUser`, body, { headers });
  }

  addUserToChannel(groupId: number, userId: number, channelId: string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    const body = { groupId, userId, channelId };
    return this.http.post(`${this.baseUrl}/channel/addUser`, body, { headers });
  }

  removeUserFromChannel(groupId: number, userId: number, channelId: string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    const body = { groupId, userId, channelId };
    return this.http.post(`${this.baseUrl}/channel/removeUser`, body, { headers });
  }

  removeUserFromGroup(groupId: string, userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    const body = { groupId, userId };
    return this.http.post(`${this.baseUrl}/group/removeUser`, body, { headers });
  }

  getUsers(): Observable<any> {
    const headers = new HttpHeaders({ 'authorization': `${this.auth.getToken()}` });
    return this.http.get<any[]>(`${this.baseUrl}/user/users`, { headers });
  }
}
