import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'default' | 'ocean' | 'forest' | 'sunset' | 'rose' | 'slate';

export const VALID_COLOR_THEMES: ColorTheme[] = ['default', 'ocean', 'forest', 'sunset', 'rose', 'slate'];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public currentThemeMode = signal<ThemeMode>('system');
  public currentColorTheme = signal<ColorTheme>('default');

  constructor() { }

  public initializeTheme() {
    // 1. Carica e applica la preferenza per il tema chiaro/scuro
    const savedTheme = localStorage.getItem('wodlog-theme-preference') as ThemeMode;
    if (savedTheme) {
      this.currentThemeMode.set(savedTheme);
      this.applyThemeMode(savedTheme);
    } else {
      this.applyThemeMode('system');
    }

    // 2. Carica e applica il colore di accento
    const savedColor = localStorage.getItem('wodlog-color-theme') as ColorTheme;
    if (savedColor && VALID_COLOR_THEMES.includes(savedColor)) {
      this.currentColorTheme.set(savedColor);
      this.applyColorTheme(savedColor);
    } else {
      this.applyColorTheme('default');
    }

    // Listener per i cambiamenti dello schema di colori del sistema se il tema è "system"
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentThemeMode() === 'system') {
        this.toggleDarkPalette(e.matches);
      }
    });
  }

  // Proprietà di compatibilità per codice preesistente
  public get currentTheme() {
    return this.currentThemeMode;
  }

  public setTheme(theme: ThemeMode) {
    this.setThemeMode(theme);
  }

  public setThemeMode(theme: ThemeMode) {
    this.currentThemeMode.set(theme);
    localStorage.setItem('wodlog-theme-preference', theme);
    this.applyThemeMode(theme);
  }

  public setColorTheme(color: ColorTheme) {
    if (VALID_COLOR_THEMES.includes(color)) {
      this.currentColorTheme.set(color);
      localStorage.setItem('wodlog-color-theme', color);
      this.applyColorTheme(color);
    }
  }

  private applyThemeMode(theme: ThemeMode) {
    if (theme === 'dark') {
      this.toggleDarkPalette(true);
    } else if (theme === 'light') {
      this.toggleDarkPalette(false);
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.toggleDarkPalette(prefersDark);
    }
  }

  private applyColorTheme(color: ColorTheme) {
    // Rimuove tutti i temi precedenti tranne default
    VALID_COLOR_THEMES.forEach(t => {
      if (t !== 'default') {
        document.documentElement.classList.remove(`theme-${t}`);
      }
    });

    // Applica il nuovo tema di colore
    if (color !== 'default') {
      document.documentElement.classList.add(`theme-${color}`);
    }
  }

  private toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
