# Booking.com Kalender-Integration Setup

Diese Anleitung erklärt, wie Sie den Booking.com Kalender für Ihre Ferienwohnung freigeben und als GitHub Secret konfigurieren, damit die automatische Synchronisation funktioniert.

## 1. Booking.com Kalender freigeben

### Schritt 1: Bei Booking.com Admin anmelden
1. Gehen Sie zu [admin.booking.com](https://admin.booking.com)
2. Melden Sie sich mit Ihren Admin-Anmeldedaten an
3. Wählen Sie Ihre Unterkunft aus der Liste aus

### Schritt 2: Kalender-Export finden
1. Suchen Sie im Admin-Dashboard nach **"Calendar"** oder **"Kalender"**
2. Klicken Sie auf **"Calendar Management"** oder **"Kalender-Verwaltung"**
3. Suchen Sie nach **"Sync calendar"**, **"Export"** oder **"iCal"**
4. Alternativ: Schauen Sie unter **"Settings"** → **"Calendar sync"**

### Schritt 3: iCal URL generieren
1. Aktivieren Sie **"Enable calendar export"** oder **"Kalender-Export aktivieren"**
2. Booking.com generiert eine eindeutige iCal URL
3. Diese URL sieht etwa so aus: `https://admin.booking.com/hotel/ical/XXXXXX.ics?token=abcd1234`
4. **Wichtig:** Kopieren Sie die vollständige URL inklusive Token
5. **Sicherheit:** Diese URL enthält sensible Daten - teilen Sie sie niemals öffentlich!

### Alternative Suche
Falls Sie den Kalender-Export nicht sofort finden:
1. Nutzen Sie die **Suchfunktion** im Admin-Bereich mit "iCal", "sync" oder "export"
2. Schauen Sie unter **"Property"** → **"Calendar"** → **"Sync settings"**
3. Bei Problemen: Kontaktieren Sie den Booking.com Support über das Admin-Panel

## 2. GitHub Secret konfigurieren

### Schritt 1: GitHub Repository öffnen
1. Gehen Sie zu Ihrem GitHub Repository: `https://github.com/mainurlaubsstop/mainurlaubsstop.github.io`
2. Klicken Sie auf **"Settings"** (Einstellungen-Tab)
3. Scrollen Sie im linken Menü zu **"Secrets and variables"**
4. Klicken Sie auf **"Actions"**

### Schritt 2: Neues Secret erstellen
1. Klicken Sie auf **"New repository secret"**
2. Als **Name** verwenden Sie: `BOOKING_CALENDAR_URL`
3. Als **Value** fügen Sie die komplette iCal URL von Booking.com ein
4. Klicken Sie auf **"Add secret"**

### Beispiel Secret-Konfiguration:
```
Name: BOOKING_CALENDAR_URL
Value: https://admin.booking.com/hotel/ical/1234567.ics?token=abc123xyz789
```

## 3. GitHub Action testen

### Schritt 1: Manuelle Ausführung
1. Gehen Sie zu **"Actions"** in Ihrem GitHub Repository
2. Wählen Sie den Workflow **"Sync Booking Calendar"**
3. Klicken Sie auf **"Run workflow"** → **"Run workflow"**
4. Warten Sie ca. 1-2 Minuten auf die Ausführung

### Schritt 2: Logs prüfen
1. Klicken Sie auf den ausgeführten Workflow
2. Öffnen Sie den Job **"sync-calendar"**
3. Prüfen Sie die Logs auf Fehlermeldungen
4. Bei Erfolg sollten Sie sehen: `"Calendar data changed, triggering build"`

### Schritt 3: Website prüfen
1. Besuchen Sie Ihre Website: `https://mainurlaubsstop.github.io/verfuegbarkeit`
2. Der Kalender sollte die aktuellen Buchungen von Booking.com anzeigen
3. Die Seite wird automatisch alle 5 Minuten aktualisiert

## 4. Troubleshooting

### Problem: "No calendar URL configured"
- **Lösung:** Prüfen Sie, ob das GitHub Secret `BOOKING_CALENDAR_URL` korrekt erstellt wurde
- **Prüfung:** Settings → Secrets and variables → Actions → BOOKING_CALENDAR_URL sollte existieren

### Problem: "Failed to fetch calendar"
- **Lösung 1:** Prüfen Sie die iCal URL in einem Browser - sie sollte eine .ics Datei herunterladen
- **Lösung 2:** Stellen Sie sicher, dass der Kalender-Export in Booking.com aktiviert ist
- **Lösung 3:** Die URL könnte abgelaufen sein - generieren Sie eine neue in Booking.com

### Problem: "Calendar data unchanged"
- **Normal:** Das bedeutet, dass sich die Buchungen nicht geändert haben
- **Info:** Die Website wird nur bei Änderungen neu gebaut (spart Ressourcen)

### Problem: Kalender zeigt falsche Daten
- **Lösung:** Löschen Sie das GitHub Secret und erstellen es neu mit der aktuellen URL
- **Zeitzone:** Stellen Sie sicher, dass die Zeitzone in Booking.com korrekt eingestellt ist

## 5. Wartung und Updates

### Regelmäßige Prüfungen
- **Monatlich:** Prüfen Sie, ob der Kalender korrekt synchronisiert wird
- **Bei Problemen:** Generieren Sie eine neue iCal URL in Booking.com
- **GitHub Actions:** Überwachen Sie die Workflow-Ausführungen auf Fehler

### URL-Erneuerung
Falls die iCal URL nicht mehr funktioniert:
1. Gehen Sie zu admin.booking.com → Kalender → Export/Sync
2. Deaktivieren Sie den iCal-Export kurz
3. Aktivieren Sie ihn wieder - ein neuer Token wird generiert
4. Aktualisieren Sie das GitHub Secret mit der neuen URL

### Überwachung
Die GitHub Action läuft alle 5 Minuten. Sie können die Ausführungen hier überwachen:
- **GitHub Repository** → **Actions** → **Sync Booking Calendar**
- Bei Fehlern erhalten Sie E-Mail-Benachrichtigungen (falls aktiviert)

## 6. Sicherheitshinweise

### Wichtige Sicherheitsaspekte
- ✅ **iCal URL niemals öffentlich teilen** - sie enthält Zugriffstokens
- ✅ **GitHub Secrets verwenden** - niemals URLs in Code commiten
- ✅ **Regelmäßig URL erneuern** - alle 3-6 Monate für bessere Sicherheit
- ❌ **URL nicht in E-Mails verschicken** oder in Chat-Nachrichten verwenden
- ❌ **URL nicht in öffentliche Repositories commiten**

### Zugriffsrechte
- Die iCal URL gewährt **nur Lesezugriff** auf Buchungsdaten
- **Keine Buchungen** können über diese URL erstellt oder geändert werden
- Die URL zeigt nur **Belegungszeiten**, keine persönlichen Gästedaten

## 7. Support

Bei Problemen mit der Einrichtung:

### Booking.com Support
- **Admin-Panel:** Support-Button im admin.booking.com Dashboard
- **Hilfe-Center:** Über das "Help" Menü im Admin-Bereich erreichbar
- **Live-Chat:** Oft verfügbar über das Admin-Interface

### GitHub/Website Support
- **GitHub Issues:** Erstellen Sie ein Issue in diesem Repository
- **Dokumentation:** Siehe README.md für weitere technische Details

---

## Schnellstart-Checkliste

- [ ] Bei admin.booking.com anmelden
- [ ] Kalender/Calendar → Export/Sync → iCal aktivieren
- [ ] iCal URL kopieren (vollständige URL mit Token)
- [ ] GitHub Repository → Settings → Secrets and variables → Actions
- [ ] Neues Secret: Name = `BOOKING_CALENDAR_URL`, Value = iCal URL
- [ ] GitHub Actions → "Sync Booking Calendar" → "Run workflow"  
- [ ] Website prüfen: `/verfuegbarkeit` sollte Kalender anzeigen
- [ ] Bei Problemen: Logs in GitHub Actions prüfen

**Geschätzter Zeitaufwand:** 10-15 Minuten für die Ersteinrichtung.

---

*Diese Integration wurde entwickelt für MainUrlaubsStop. Bei Fragen zur technischen Umsetzung wenden Sie sich an den Website-Administrator.*