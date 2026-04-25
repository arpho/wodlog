import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WodFormComponent } from './wod-form.component';
<<<<<<< HEAD
import { provideIonicAngular } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';
=======
import { ModalController } from '@ionic/angular/standalone';
>>>>>>> origin/reorder

describe('WodFormComponent', () => {
  let component: WodFormComponent;
  let fixture: ComponentFixture<WodFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WodFormComponent],
      providers: [
<<<<<<< HEAD
        provideIonicAngular(),
        { provide: WodService, useValue: { fetchWodsRealtime: () => {} } }
=======
        { provide: ModalController, useValue: { create: () => ({ present: () => {}, onDidDismiss: () => ({ data: null }) }) } }
>>>>>>> origin/reorder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
