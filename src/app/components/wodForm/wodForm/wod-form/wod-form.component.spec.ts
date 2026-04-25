import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WodFormComponent } from './wod-form.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { WodService } from 'src/app/services/wod/wod.service';

describe('WodFormComponent', () => {
  let component: WodFormComponent;
  let fixture: ComponentFixture<WodFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [WodFormComponent],
      providers: [
        provideIonicAngular(),
        { provide: WodService, useValue: { fetchWodsRealtime: () => {} } }
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
