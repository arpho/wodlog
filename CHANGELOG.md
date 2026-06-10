# WodLog Changelog

Tutte le novità e gli aggiornamenti del progetto WodLog.

## Giugno 2026

### Gemini API SDK Migration
- **Features (Migrazione GenAI)**: Rimosso il pacchetto obsoleto `@google/generative-ai` e migrato l'intero strato backend OCR all'SDK ufficiale `@google/genai` per una lettura stabile e duratura dei WOD ed Esercizi di Forza.
- **Performance (Pulizia Backend)**: Rimossi completamente i pacchetti `genkit` e ottimizzate le Cloud Functions per un'esecuzione più veloce e leggera.

## Maggio 2026

### Real-time Active Notifications & Security Fixed
- **Security**: Ottimizzate le regole di sicurezza (`database.rules.json`) usando `!== false` ed introdotto un meccanismo di fallback sicuro sul database per abilitare l'amministratore all'istante.
- **Fix**: Rimosso il vincolo di abilitazione per l'accesso del proprio profilo `userProfile/$uid`, evitando blocchi e ripristinando il corretto caricamento di Gravatar.
- **Features**: Integrazione reattiva in `AppComponent` per avvisare subito l'utente con una notifica Toast targata **WodLog** quando l'account viene abilitato, eseguendo in background l'auto-refresh dei claims locali.
- **Design**: Aggiornato il menù utente con la voce *"Permessi Utenti"* ed inserito il pulsante quadrato reattivo in Home.
- **Database**: Creato `migrate-to-firestore.js` per il passaggio strutturato e compatibile dei dati a Cloud Firestore Native.

### User Administration & Secure Onboarding
- **Performance**: Rimosse interamente le librerie `primeng` e `primeicons` dal progetto, riducendo drasticamente il peso del bundle mobile ed eliminando codice inutilizzato.
- **Features**: Riscritto il grafico dei massimali (`PrGraphComponent`) utilizzando direttamente un elemento HTML5 `<canvas>` e la libreria nativa `chart.js` per caricamenti istantanei su smartphone.
- **Security**: I nuovi utenti registrati non sono abilitati di default (`enabled: false`), bloccando accessi non autorizzati in attesa di approvazione.
- **Features**: Nuova console di amministrazione accessibile ai soli Editor (`/users`) per visualizzare, cercare e filtrare tutti gli atleti.
- **Features**: Schermata sicura di gestione privilegi (`/users/:uid/privilegies`) per promuovere gli atleti a Editor o abilitare/disabilitare gli account.
- **Features**: Notifiche Real-time per segnalare istantaneamente nuove iscrizioni in attesa.
- **Fix**: Correzione Test Unitari (34/34 SUCCESS).

### Multi-User Security & Privileges
- **Security**: Implementato modello di sicurezza multilivello basato su Firebase Auth Custom Claims (enabled e role).
- **Features**: Auto-Onboarding e Gestione privilegi tramite Cloud Function sicura `setClaims`.
- **Features**: OCR Protetti per limitare le funzioni AI ai soli utenti autenticati.
- **Performance**: Ottimizzazione delle query dei risultati WOD.

### PR Details & UX Enhancements
- **Features**: Visualizzazione estesa dei PR nel profilo e link rapido Home.
- **UX**: Rimpiazzato l'interruttore nel form delle attività con un elegante controllo a segmenti `ion-segment`.
- **Design**: Aggiunti tooltip descrittivi con effetto blur glassmorphism.

### Athlete Profile & Storage Update
- **Features**: Modalità doppia Vista e Modifica per il Profilo Atleta e integrazione di Firebase Storage per le immagini.
- **Design**: Layout premium glassmorphic.

### Drag & Drop Update
- **Features**: Ripristinato il Drag & Drop per il riordinamento manuale degli esercizi.
- **UX**: Separazione delle gesture tramite maniglia nativa.

### Midnight Ocean Update
- **Design**: Restyling completo con estetica Midnight Ocean e Theme Switcher dinamico.
- **UX**: Integrazione globale del User Menu.
- **Fix**: Ripristinata interamente la suite di Test Unitari.

## Version 1.0.0
### Initial Release
- Lancio ufficiale di WodLog: gestione workout, massimali e statistiche.
