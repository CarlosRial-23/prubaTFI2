import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

if (typeof window !== 'undefined' && window.navigator) {
  Object.defineProperty(window.navigator, 'locks', {
    value: {
      request: async (name: any, callback: any) => {
        return callback();
      },
      query: async () => ({ held: [], pending: [] })
    },
    configurable: true
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
