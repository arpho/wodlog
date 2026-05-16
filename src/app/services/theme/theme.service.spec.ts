import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.clear();
    document.documentElement.classList.remove('ion-palette-dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('ion-palette-dark');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with system theme if nothing saved', () => {
    service.initializeTheme();
    expect(service.currentTheme()).toBe('system');
  });

  it('should initialize with saved theme', () => {
    localStorage.setItem('theme-preference', 'dark');
    service.initializeTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBeTrue();
  });

  it('should set theme and apply class', () => {
    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
    expect(localStorage.getItem('theme-preference')).toBe('dark');
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBeTrue();

    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
    expect(localStorage.getItem('theme-preference')).toBe('light');
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBeFalse();
  });
});
