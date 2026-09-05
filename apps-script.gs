/*
  OSA-backend – mall för Google Apps Script.

  VIKTIGT:
  - Lägg aldrig Spreadsheet-ID, gästlista eller OSA-koder i detta publika GitHub-repo.
  - Det riktiga Spreadsheet-ID:t ska sparas som en Script Property i Apps Script.
  - Den här filen är bara en utvecklingsmall tills OSA-systemet byggs färdigt.

  Planerad datamodell i privat Google Sheet:
    INVITATIONS: code, householdName, email, phone, status, updatedAt
    GUESTS: guestId, code, firstName, lastName, friday, saturday, sunday, plusOne
    RSVP: guestId, attending, food, allergy, busToVenue, nightBus, stop, accessibility, notes
*/

const SHEET_NAMES = {
  invitations: 'INVITATIONS',
  guests: 'GUESTS',
  rsvp: 'RSVP'
};

function doGet() {
  return jsonResponse_({
    ok: true,
    status: 'not-configured',
    message: 'OSA-backenden är ännu inte aktiverad.'
  });
}

function doPost(e) {
  // Implementeras när gästlistan är fastställd.
  // Plan:
  // 1. Tolka JSON-request.
  // 2. Validera personlig kod server-side.
  // 3. Returnera endast gäster kopplade till koden.
  // 4. Ta emot och validera OSA-svar.
  // 5. Spara svar i privat Google Sheet.
  // 6. Tillåt ändring fram till OSA-deadline.
  // 7. Lägg till enkel rate limiting innan publik lansering.
  return jsonResponse_({
    ok: false,
    status: 'not-configured',
    message: 'OSA är ännu inte öppet.'
  });
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('WEDDING_SPREADSHEET_ID');
  if (!id) {
    throw new Error('WEDDING_SPREADSHEET_ID saknas i Script Properties.');
  }
  return SpreadsheetApp.openById(id);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
