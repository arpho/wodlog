import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { getDatabase, ref, push, set, get } from '@firebase/database';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}

  /**
   * Registra il token FCM del dispositivo per l'utente loggato.
   */
  async registerFCMToken(userId: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('Registrazione FCM saltata: non su piattaforma nativa.');
      return;
    }

    try {
      const PushNotifications = (await import('@capacitor/push-notifications')).PushNotifications;

      // Rimuoviamo listener precedenti per evitare duplicazioni
      await PushNotifications.removeAllListeners();

      // Listener per la registrazione del token
      await PushNotifications.addListener('registration', async (token) => {
        const tokenValue = token.value;
        console.log('FCM Token ricevuto:', tokenValue);
        
        const db = getDatabase();
        const tokensRef = ref(db, `fcmTokens/${userId}`);
        
        // Verifica se il token esiste già per questo utente
        const snapshot = await get(tokensRef);
        let exists = false;
        if (snapshot.exists()) {
          const existingTokens = snapshot.val();
          Object.values(existingTokens).forEach((val: any) => {
            if (val && val.token === tokenValue) {
              exists = true;
            }
          });
        }

        if (!exists) {
          const newTokenRef = push(tokensRef);
          await set(newTokenRef, {
            token: tokenValue,
            updatedAt: Date.now(),
            platform: Capacitor.getPlatform()
          });
          console.log('FCM Token salvato nel Realtime Database per l\'utente:', userId);
        } else {
          console.log('FCM Token già presente nel database.');
        }
      });

      // Listener per errori di registrazione
      await PushNotifications.addListener('registrationError', (err) => {
        console.error('Errore durante la registrazione push nativa:', err);
      });

      // Listener per notifiche push ricevute in primo piano (foreground)
      await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
        console.log('Notifica push nativa ricevuta in primo piano:', notification);
        if (notification.title && notification.body) {
          await this.showNotification(notification.title, notification.body);
        }
      });

      // Richiedi i permessi ed esegui la registrazione nativa
      const hasPermission = await this.requestPermission();
      if (hasPermission) {
        console.log('Richiesta registrazione dispositivo per notifiche push...');
      }
    } catch (err) {
      console.error('Errore nell\'inizializzazione di FCM nativo:', err);
    }
  }

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
