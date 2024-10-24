import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { AdminGuard } from './services/admin-guard.service';

// Define routes for standalone components
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
  { path: 'chat', loadComponent: () => import('./chat-room/chat-room.component').then(m => m.ChatRoomComponent), canActivate: [AuthGuard] },
  { path: 'video-chat', loadComponent: () => import('./video-chat-room/video-chat-room.component').then(m => m.VideoChatRoomComponent), canActivate: [AuthGuard] },
  { path: 'admin', loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [AuthGuard, AdminGuard] },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },

  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route redirects to /login
  { path: '**', redirectTo: '/login' }  // Wildcard route to handle unknown paths
];
