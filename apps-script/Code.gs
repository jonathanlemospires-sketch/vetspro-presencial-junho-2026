/**
 * Apps Script — captura de leads da landing v1 (verde médico).
 *
 * Como deployar (uma única vez):
 *   1. Abra a planilha "Leads Presencial — Landing v1 (verde médico)":
 *      https://docs.google.com/spreadsheets/d/17xsuA6clrY1U_ofITrsnBIiMjEC0eLb3YeIjPNR5ey4/edit
 *   2. Menu → Extensões → Apps Script.
 *   3. Apague o código padrão e cole TODO este arquivo.
 *   4. Ctrl+S. Nome do projeto: "Leads VetsPRO v1".
 *   5. Implantar → Nova implantação → engrenagem ⚙️ → "Aplicativo da Web".
 *      - Executar como: Eu
 *      - Quem tem acesso: Qualquer pessoa
 *      - Implantar → autorize.
 *   6. Copie a "URL do aplicativo da Web" e me envie — coloco em app.js.
 */

const SHEET_ID = '17xsuA6clrY1U_ofITrsnBIiMjEC0eLb3YeIjPNR5ey4';
const TZ = 'America/Sao_Paulo';
const TAB_NAME = 'Leads';

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    const nome = String(params.nome || '').trim();
    const ddd = String(params.ddd || '').replace(/\D/g, '').trim();
    const wpp = String(params.whatsapp || '').replace(/\D/g, '').trim();
    const source = String(params.source || '').trim();

    if (!nome || !ddd || !wpp) return _json({ ok: false, error: 'Campos obrigatórios faltando.' });

    const now = new Date();
    const data = Utilities.formatDate(now, TZ, 'dd/MM/yyyy');
    const hora = Utilities.formatDate(now, TZ, 'HH:mm:ss');
    const completo = '+55' + ddd + wpp;

    const sheet = _getOrCreateSheet();
    sheet.appendRow([data, hora, nome, ddd, wpp, completo, source]);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Web App OK (v1) — use POST com nome, ddd, whatsapp.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function _getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) {
    const first = ss.getSheets()[0];
    if (first && /^(P[áa]gina ?1|Sheet ?1|Folha ?1|Página1)$/i.test(first.getName())) {
      first.setName(TAB_NAME);
      sheet = first;
    } else {
      sheet = ss.insertSheet(TAB_NAME);
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Data', 'Hora', 'Nome', 'DDD', 'WhatsApp', 'WhatsApp Completo', 'Origem']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#0c2317').setFontColor('#ecf9ee');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, 7, 140);
    sheet.setColumnWidth(3, 240);
    sheet.setColumnWidth(6, 180);
  }
  return sheet;
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
