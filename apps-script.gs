/*
  Backend för OSA samt tal och spex.

  Rekommenderad setup:
  1. Öppna det privata Google Sheetet för bröllopet.
  2. Välj Tillägg > Apps Script så att skriptet blir bundet till kalkylarket.
  3. Klistra in denna kod och publicera som Web App.

  Lägg toastteamets mejladresser i Script Property:
  TOAST_EMAILS = adresser separerade med kommatecken

  Om skriptet i stället körs fristående kan Script Property
  WEDDING_SPREADSHEET_ID användas för att peka ut rätt kalkylark.

  Web App:
  Execute as: Me
  Who has access: Anyone
*/

const SHEET_NAMES = {
  invitations: 'INBJUDNINGAR',
  guests: 'GÄSTER',
  rsvp: 'OSA',
  toast: 'TAL & SPEX'
};

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || 'status');
    if (action === 'lookup') return jsonResponse_(lookupInvitation_(e.parameter.code));
    return jsonResponse_({ ok: true, status: 'ready' });
  } catch (err) {
    return jsonResponse_({ ok: false, error: err.message || String(err) });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = String(payload.action || '');
    if (action === 'saveRsvp') return jsonResponse_(saveRsvp_(payload));
    if (action === 'saveToast') return jsonResponse_(saveToast_(payload));
    return jsonResponse_({ ok: false, error: 'Okänd åtgärd.' });
  } catch (err) {
    return jsonResponse_({ ok: false, error: err.message || String(err) });
  }
}

function lookupInvitation_(rawCode) {
  const code = normalizeCode_(rawCode);
  const ss = getSpreadsheet_();
  const invitations = sheetObjects_(ss.getSheetByName(SHEET_NAMES.invitations));
  const invitation = invitations.find(row => normalizeCode_(row['Kod']) === code);
  if (!invitation) return { ok: false, error: 'Koden kunde inte hittas.' };

  const allGuests = sheetObjects_(ss.getSheetByName(SHEET_NAMES.guests));
  const guests = allGuests
    .filter(row => normalizeCode_(row['Kod']) === code && bool_(row['Lördag']))
    .map(row => ({
      guestId: String(row['Gäst-ID'] || ''),
      firstName: String(row['Förnamn'] || ''),
      lastName: String(row['Efternamn'] || ''),
      friday: bool_(row['Fredag']),
      saturday: bool_(row['Lördag']),
      sunday: bool_(row['Söndag'])
    }));

  if (!guests.length) return { ok: false, error: 'Inbjudan saknar registrerade gäster.' };

  const rsvpRows = sheetObjects_(ss.getSheetByName(SHEET_NAMES.rsvp));
  const previousByGuest = {};
  rsvpRows.forEach(row => {
    const guestId = String(row['Gäst-ID'] || '');
    if (!guestId) return;
    previousByGuest[guestId] = {
      attending: String(row['Kommer'] || ''),
      food: String(row['Kostpreferens'] || ''),
      allergies: allergyListFromRow_(row),
      otherAllergy: String(row['Annan allergi/intolerans'] || ''),
      bus: String(row['Buss vigsel→fest'] || ''),
      home: String(row['Transport hem'] || ''),
      stay: String(row['Boendeort'] || ''),
      friday: String(row['Fredagsmingel'] || ''),
      sunday: String(row['Söndagsfrukost'] || ''),
      song: String(row['Låtönskemål'] || ''),
      funAnswer: String(row['Vem gråter först?'] || ''),
      notes: String(row['Övrigt'] || '')
    };
  });

  return {
    ok: true,
    invitation: {
      code,
      householdName: String(invitation['Hushåll'] || ''),
      email: String(invitation['Kontaktmejl'] || ''),
      fridayInvited: bool_(invitation['Fredag inbjuden']),
      sundayInvited: bool_(invitation['Söndag inbjuden'])
    },
    guests: guests.map(guest => ({ ...guest, previous: previousByGuest[guest.guestId] || null }))
  };
}

function saveRsvp_(payload) {
  const code = normalizeCode_(payload.code);
  const submittedGuests = Array.isArray(payload.guests) ? payload.guests : [];
  if (!submittedGuests.length) throw new Error('Inga gästsvar skickades in.');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const ss = getSpreadsheet_();
    const invitationSheet = ss.getSheetByName(SHEET_NAMES.invitations);
    const guestSheet = ss.getSheetByName(SHEET_NAMES.guests);
    const rsvpSheet = ss.getSheetByName(SHEET_NAMES.rsvp);

    const invitationValues = invitationSheet.getDataRange().getValues();
    const invitationHeaders = invitationValues[0];
    const codeCol = invitationHeaders.indexOf('Kod');
    const emailCol = invitationHeaders.indexOf('Kontaktmejl');
    const statusCol = invitationHeaders.indexOf('Status');
    const updatedCol = invitationHeaders.indexOf('Senast uppdaterad');
    const invitationRowIndex = invitationValues.findIndex((row, i) => i > 0 && normalizeCode_(row[codeCol]) === code);
    if (invitationRowIndex < 1) throw new Error('Koden kunde inte hittas.');

    const allowedGuests = sheetObjects_(guestSheet).filter(row => normalizeCode_(row['Kod']) === code && bool_(row['Lördag']));
    const allowedById = {};
    allowedGuests.forEach(row => { allowedById[String(row['Gäst-ID'])] = row; });

    const seen = {};
    submittedGuests.forEach(answer => {
      const guestId = String(answer.guestId || '');
      if (!allowedById[guestId]) throw new Error('Ett gästsvar hör inte till denna inbjudan.');
      if (seen[guestId]) throw new Error('Samma gäst skickades in flera gånger.');
      seen[guestId] = true;
    });

    const rsvpValues = rsvpSheet.getDataRange().getValues();
    const rsvpHeaders = rsvpValues[0];
    const rsvpGuestIdCol = rsvpHeaders.indexOf('Gäst-ID');
    const existingRowById = {};
    rsvpValues.forEach((row, i) => {
      if (i === 0) return;
      const guestId = String(row[rsvpGuestIdCol] || '');
      if (guestId) existingRowById[guestId] = i + 1;
    });

    const now = new Date();
    submittedGuests.forEach(answer => {
      const guestRow = allowedById[String(answer.guestId)];
      const attending = cleanChoice_(answer.attending, ['Ja', 'Nej']);
      const isComing = attending === 'Ja';
      const allergies = Array.isArray(answer.allergies) ? answer.allergies : [];
      const fullName = [guestRow['Förnamn'], guestRow['Efternamn']].filter(Boolean).join(' ');

      const row = [
        String(answer.guestId),
        code,
        fullName,
        attending,
        isComing ? cleanChoice_(answer.food, ['Äter allt', 'Vegetariskt', 'Veganskt', 'Pescetariskt', 'Annat']) : '',
        isComing && allergies.includes('Gluten eller celiaki'),
        isComing && allergies.includes('Laktos'),
        isComing && allergies.includes('Mjölkprotein'),
        isComing && allergies.includes('Nötter'),
        isComing && allergies.includes('Jordnötter'),
        isComing && allergies.includes('Ägg'),
        isComing && allergies.includes('Fisk'),
        isComing && allergies.includes('Skaldjur'),
        isComing ? cleanText_(answer.otherAllergy, 500) : '',
        isComing ? cleanChoice_(answer.bus, ['Ja', 'Nej']) : '',
        isComing ? cleanChoice_(answer.home, ['Nattbuss', 'Egen bil', 'Skjuts', 'Taxi', 'Annat eller vet inte ännu']) : '',
        isComing ? cleanText_(answer.stay, 200) : '',
        isComing && bool_(guestRow['Fredag']) ? cleanChoice_(answer.friday, ['Ja', 'Nej', 'Vet inte ännu']) : '',
        isComing && bool_(guestRow['Söndag']) ? cleanChoice_(answer.sunday, ['Ja', 'Nej', 'Vet inte ännu']) : '',
        isComing ? cleanText_(answer.song, 300) : '',
        isComing ? cleanChoice_(answer.funAnswer, ['Einar', 'Lovisa', 'Båda samtidigt', 'Någon i toastteamet', 'Vet inte']) : '',
        cleanText_(answer.notes, 1000),
        now
      ];

      const targetRow = existingRowById[String(answer.guestId)];
      if (targetRow) rsvpSheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
      else rsvpSheet.appendRow(row);
    });

    const spreadsheetRow = invitationRowIndex + 1;
    const email = cleanEmail_(payload.email);
    if (email && emailCol >= 0) invitationSheet.getRange(spreadsheetRow, emailCol + 1).setValue(email);
    if (statusCol >= 0) invitationSheet.getRange(spreadsheetRow, statusCol + 1).setValue('Svarat');
    if (updatedCol >= 0) invitationSheet.getRange(spreadsheetRow, updatedCol + 1).setValue(now);

    return { ok: true, saved: submittedGuests.length };
  } finally {
    lock.releaseLock();
  }
}

function saveToast_(payload) {
  const name = cleanText_(payload.name, 200);
  const email = cleanEmail_(payload.email);
  const type = cleanChoice_(payload.type, ['Tal', 'Spex', 'Sång eller musik', 'Film', 'Överraskning', 'Annat']);
  if (!name || !email || !type) throw new Error('Namn, mejladress och typ måste fyllas i.');

  const row = [
    new Date(),
    name,
    email,
    type,
    cleanText_(payload.description, 2000),
    cleanText_(payload.participants, 1000),
    cleanText_(payload.length, 100),
    bool_(payload.microphone),
    bool_(payload.audio),
    bool_(payload.projector),
    cleanText_(payload.otherTech, 1000),
    cleanChoice_(payload.secret, ['Ja', 'Nej']),
    cleanText_(payload.notes, 2000)
  ];

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    getSpreadsheet_().getSheetByName(SHEET_NAMES.toast).appendRow(row);
  } finally {
    lock.releaseLock();
  }

  const recipients = String(PropertiesService.getScriptProperties().getProperty('TOAST_EMAILS') || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  let mailSent = false;
  if (recipients.length) {
    const subject = 'Bröllopet: ' + type + ' från ' + name;
    const body = [
      'Ny anmälan till toastteamet',
      '',
      'Namn: ' + name,
      'Mejl: ' + email,
      'Typ: ' + type,
      'Ungefärlig längd: ' + cleanText_(payload.length, 100),
      'Deltagare: ' + cleanText_(payload.participants, 1000),
      'Hemligt för brudparet: ' + cleanChoice_(payload.secret, ['Ja', 'Nej']),
      '',
      'Beskrivning:',
      cleanText_(payload.description, 2000),
      '',
      'Tekniska behov:',
      [
        bool_(payload.microphone) ? 'Mikrofon' : '',
        bool_(payload.audio) ? 'Ljuduppspelning' : '',
        bool_(payload.projector) ? 'Projektor eller skärm' : '',
        cleanText_(payload.otherTech, 1000)
      ].filter(Boolean).join(', ') || 'Inga angivna',
      '',
      'Övrigt:',
      cleanText_(payload.notes, 2000)
    ].join('\n');

    MailApp.sendEmail({
      to: recipients.join(','),
      replyTo: email,
      subject,
      body,
      name: 'Einar & Lovisa, bröllop 2027'
    });
    mailSent = true;
  }

  return { ok: true, saved: true, mailSent };
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('WEDDING_SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error('Skriptet är inte bundet till något kalkylark och WEDDING_SPREADSHEET_ID saknas.');
}

function sheetObjects_(sheet) {
  if (!sheet) throw new Error('Ett nödvändigt kalkylblad saknas.');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => { obj[header] = row[i]; });
    return obj;
  });
}

function allergyListFromRow_(row) {
  return [
    ['Gluten eller celiaki', 'Gluten/celiaki'],
    ['Laktos', 'Laktos'],
    ['Mjölkprotein', 'Mjölkprotein'],
    ['Nötter', 'Nötter'],
    ['Jordnötter', 'Jordnötter'],
    ['Ägg', 'Ägg'],
    ['Fisk', 'Fisk'],
    ['Skaldjur', 'Skaldjur']
  ].filter(pair => bool_(row[pair[1]])).map(pair => pair[0]);
}

function normalizeCode_(value) {
  const code = String(value || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!/^[A-Z0-9]{6,12}$/.test(code)) throw new Error('Ogiltigt kodformat.');
  return code;
}

function cleanText_(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength || 1000);
}

function cleanEmail_(value) {
  const email = cleanText_(value, 320).toLowerCase();
  if (!email) return '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Ogiltig mejladress.');
  return email;
}

function cleanChoice_(value, allowed) {
  const text = cleanText_(value, 200);
  if (!text) return '';
  if (!allowed.includes(text)) throw new Error('Ett svar innehöll ett ogiltigt val.');
  return text;
}

function bool_(value) {
  if (value === true) return true;
  const text = String(value || '').trim().toLowerCase();
  return ['true', 'ja', 'yes', '1', 'x'].includes(text);
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
