import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangelogPage } from './changelog.page';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';

describe('ChangelogPage', () => {
  let component: ChangelogPage;
  let fixture: ComponentFixture<ChangelogPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangelogPage],
      providers: [provideRouter([]), provideIonicAngular()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
