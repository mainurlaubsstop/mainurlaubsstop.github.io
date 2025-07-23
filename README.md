# MainUrlaubsStop - Ferienwohnung Website

Eine moderne, mehrsprachige Hugo-Website für die Ferienwohnung MainUrlaubsStop in Wipfeld am Main.

## Features

- 🌍 **Mehrsprachig**: Deutsch (Standard) und Englisch
- 📱 **Responsive Design**: Optimiert für alle Geräte
- 🚀 **Schnell**: Hugo Static Site Generator
- 🎨 **Modern**: Hugoplate Theme mit Tailwind CSS
- 📧 **WhatsApp Integration**: Direkte Buchung über WhatsApp
- 🖼️ **Bildergalerie**: Hochwertige Bilder der Ferienwohnung
- 🚗 **E-Auto freundlich**: Informationen zur Ladestation

## Struktur

```
├── content/
│   ├── german/          # Deutsche Inhalte
│   └── english/         # Englische Inhalte
├── static/
│   └── images/
│       └── apartment/   # Bilder der Ferienwohnung
├── config/
│   └── _default/        # Hugo Konfiguration
└── .github/
    └── workflows/       # GitHub Actions für Deployment
```

## Seiten

### Deutsch
- Startseite
- Ferienwohnung (mit Bildergalerie)
- Ausstattung & Service
- Lage & Umgebung
- Preise & Buchung
- Kontakt
- Impressum, Datenschutz, AGB

### English
- Home
- Apartment
- Booking
- Contact

## Deployment

Die Website wird automatisch über GitHub Actions auf GitHub Pages deployed:
- **Development**: https://mainurlaubsstop.github.io
- **Production**: www.mainurlaubsstop.de (später)

## Lokale Entwicklung

```bash
# Hugo Server starten
hugo server -D

# Build für Production
hugo --minify
```

## Kontakt & Buchung

- **WhatsApp**: +49 170 0000000
- **E-Mail**: info@mainurlaubsstop.de
- **Website**: https://mainurlaubsstop.github.io

## Technologie

- **Hugo**: Static Site Generator
- **Hugoplate**: Hugo Theme
- **Tailwind CSS**: Styling
- **GitHub Pages**: Hosting
- **GitHub Actions**: CI/CD