import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';  // Import routes from app.routes.ts
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { importProvidersFrom } from '@angular/core';

const config: SocketIoConfig = { url: 'http://localhost:3001', options: {}};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Provide the router configuration with routes
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(SocketIoModule.forRoot(config)),
    // Add other providers as necessary (e.g., HttpClientModule)
  ]
}).catch(err => console.error(err));
