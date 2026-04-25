// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
<<<<<<< HEAD
import { initializeApp } from '@firebase/app';
import { environment } from './environments/environment';

// Initialize Firebase for tests
initializeApp(environment.firebase);
=======
import { initializeApp } from 'firebase/app';

// Initialize a dummy Firebase app to prevent instant crashes in services
initializeApp({ projectId: 'test', appId: 'test', apiKey: 'test' });
>>>>>>> origin/reorder

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
