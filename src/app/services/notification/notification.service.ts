import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}

  /**
   * Richiede l'autorizzazione all'invio di notifiche rilevando la piattaforma corrente.
   */
  async requestPermission(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      return this.requestNativePermission();
    } else {
      return this.requestWebPermission();
    }
  }

  /**
   * Richiede il permesso per browser tradizionali e PWA.
   */
  private async requestWebPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Questo browser non supporta le notifiche desktop.');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Richiede il permesso nativo tramite Capacitor.
   */
  private async requestNativePermission(): Promise<boolean> {
    try {
      const PushNotifications = (await import('@capacitor/push-notifications')).PushNotifications;
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      
      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Errore durante la richiesta permessi nativi con Capacitor:', err);
      // Fallback su Web API se possibile
      return this.requestWebPermission();
    }
  }

  /**
   * Mostra una notifica di sistema (Web o nativa).
   */
  async showNotification(title: string, body: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      } else {
        console.log(`[Notifica Web Simulata] ${title}: ${body}`);
      }
    } else {
      try {
        const LocalNotifications = (await import('@capacitor/local-notifications')).LocalNotifications;
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Date.now()
            }
          ]
        });
      } catch (err) {
        console.warn('Errore nell\'uso di LocalNotifications nativo, fallback su Web Notification:', err);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body });
        } else {
          console.log(`[Notifica Native Fallback Simulata] ${title}: ${body}`);
        }
      }
    }
  }
}
