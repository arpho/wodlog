import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWodPage } from './create-wod.page';
import { ModalController } from '@ionic/angular/standalone';

import { WodService } from 'src/app/services/wod/wod.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

describe('CreateWodPage', () => {
  let component: CreateWodPage;
  let fixture: ComponentFixture<CreateWodPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWodPage],
      providers: [
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }) } },
        { provide: WodService, useValue: { createWod: () => Promise.resolve('test-key') } },
        { provide: ToastController, useValue: { create: () => Promise.resolve({ present: () => {} }) } },
        { provide: Router, useValue: { navigateByUrl: () => {} } }
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
