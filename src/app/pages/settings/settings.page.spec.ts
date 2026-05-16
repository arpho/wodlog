import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { signal } from '@angular/core';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    mockThemeService = jasmine.createSpyObj('ThemeService', ['setTheme'], {
      currentTheme: signal('system')
    });

    await TestBed.configureTestingModule({
      imports: [SettingsPage],
      providers: [
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current theme from service', () => {
    expect(component.currentTheme).toBe('system');
  });

  it('should call setTheme on change', () => {
    const event = { detail: { value: 'dark' } };
    component.onThemeChange(event);
    expect(mockThemeService.setTheme).toHaveBeenCalledWith('dark');
  });
});
