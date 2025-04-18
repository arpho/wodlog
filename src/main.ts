import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircle, add, addCircleOutline, removeCircle, remove, createOutline, trashOutline,eyeOutline, ellipsisHorizontal, statsChartOutline, recordingOutline, ribbonOutline } from 'ionicons/icons';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { DatePipe } from "@angular/common";
if (environment.production) {
  enableProdMode();
}
addIcons({
  'add-circle': addCircle,
  'add-circle-outline': addCircleOutline,
  'ribbon-outline': ribbonOutline,
  'add': add,
  'eye':eyeOutline,
  'ellipsis-horizontal':ellipsisHorizontal,
  'stats-chart': statsChartOutline,
  'remove-circle': removeCircle,
  'remove': remove,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
});
bootstrapApplication(AppComponent, {
  providers: [
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    importProvidersFrom(IonicModule.forRoot()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
});
defineCustomElements(window);
