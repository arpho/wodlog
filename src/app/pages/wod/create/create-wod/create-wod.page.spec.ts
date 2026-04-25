import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWodPage } from './create-wod.page';
<<<<<<< HEAD
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';
=======
import { ModalController } from '@ionic/angular/standalone';

import { WodService } from 'src/app/services/wod/wod.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
>>>>>>> origin/reorder

describe('CreateWodPage', () => {
  let component: CreateWodPage;
  let fixture: ComponentFixture<CreateWodPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWodPage],
      providers: [
<<<<<<< HEAD
        provideRouter([]), 
        provideIonicAngular(),
        { provide: WodService, useValue: { createWod: () => Promise.resolve('') } }
=======
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }) } },
        { provide: WodService, useValue: { createWod: () => Promise.resolve('test-key') } },
        { provide: ToastController, useValue: { create: () => Promise.resolve({ present: () => {} }) } },
        { provide: Router, useValue: { navigateByUrl: () => {} } }
>>>>>>> origin/reorder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
