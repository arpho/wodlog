import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleInputComponent } from './simple-input.component';
import { ModalController } from '@ionic/angular/standalone';

describe('SimpleInputComponent', () => {
  let component: SimpleInputComponent;
  let fixture: ComponentFixture<SimpleInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SimpleInputComponent],
      providers: [
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
