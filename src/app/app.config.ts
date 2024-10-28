import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'duel-de-heros-d60e3',
        appId: '1:149544633841:web:8022e7995ba16ee79a3050',
        databaseURL: 'https://duel-de-heros-d60e3-default-rtdb.firebaseio.com',
        storageBucket: 'duel-de-heros-d60e3.appspot.com',
        apiKey: 'AIzaSyDVEKxfodGmwHcHGOZXdwTCinsHV1qgPyI',
        authDomain: 'duel-de-heros-d60e3.firebaseapp.com',
        messagingSenderId: '149544633841',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
