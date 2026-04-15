import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

if (typeof window !== 'undefined' && window.navigator) {
  Object.defineProperty(window.navigator, 'locks', {
    value: {
      request: async (...args: any[]) => {
        // Supabase manda el nombre del candado en el primer argumento
        const lockName = typeof args[0] === 'string' ? args[0] : 'supabase-lock';
        const callback = args.find(arg => typeof arg === 'function');
        
        if (callback) {
          // Creamos un candado simulado para engañar a Supabase
          const mockLock = { name: lockName, mode: 'exclusive' };
          // Ejecutamos la función de Supabase entregándole el candado falso
          return callback(mockLock);
        }
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
