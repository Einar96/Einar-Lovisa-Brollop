# Einar & Lovisa – Bröllop 2027

Bröllopshemsida för **21 augusti 2027**.

## Filer

- `index.html` – publik hemsida
- `styles.css` – design och responsiv layout
- `script.js` – rullgardinsmenyer, nedräkning och diskreta scrollanimationer
- `osa.html` – OSA-sida, stängd tills efter årsskiftet
- `apps-script.gs` – utvecklingsmall för framtida Google Apps Script-backend

## GitHub Pages

Publicera från `main`-branchens rot (`/`). När GitHub Pages är aktiverat blir adressen normalt:

`https://einar96.github.io/Einar-Lovisa-Brollop/`

## OSA – planerad lösning

OSA-systemet ska senare kopplas till ett **privat Google Sheet** via Google Apps Script.

Gästdata, personliga OSA-koder, allergier och andra personuppgifter får aldrig läggas i detta publika repository.

Planerad privat datamodell:

- `INVITATIONS`
- `GUESTS`
- `RSVP`
- `DASHBOARD`

Varje inbjudan får en unik kod. Koden verifieras server-side och visar endast gäster som hör till den aktuella inbjudan.

## Status

Första visuella versionen är byggd. Vigselplats, exakta tider, boenden, klädkod och övriga ej beslutade detaljer är medvetet markerade som kommande information.
