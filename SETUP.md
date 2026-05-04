# Setup do form de inscrição (v1 verde)

Fluxo: visitante preenche **Nome + DDD + WhatsApp** → JS dispara `InitiateCheckout` no Pixel → POST no Apps Script Web App que escreve na planilha **"Leads Presencial — Landing v1 (verde médico)"** → visitante é redirecionado pra `https://gruposvip.com/redirect/627/curso-presencial-vetspro-27-e-28-de-junho`.

## 1. Planilha (já criada)

- **Nome:** Leads Presencial — Landing v1 (verde médico)
- **ID:** `17xsuA6clrY1U_ofITrsnBIiMjEC0eLb3YeIjPNR5ey4`
- **Link:** https://docs.google.com/spreadsheets/d/17xsuA6clrY1U_ofITrsnBIiMjEC0eLb3YeIjPNR5ey4/edit

## 2. Deploy do Apps Script (1× só, ~2 min)

1. Abra a planilha.
2. Menu **Extensões → Apps Script**.
3. Cole o conteúdo de [`apps-script/Code.gs`](apps-script/Code.gs).
4. Ctrl+S (nome: "Leads VetsPRO v1").
5. **Implantar → Nova implantação** → engrenagem ⚙️ → **Aplicativo da Web**.
   - Executar como: _Eu_
   - Quem tem acesso: **Qualquer pessoa**
6. Implantar → autorizar.
7. Copia a URL e me envia — coloco em `app.js` linha ~7 (`WEB_APP_URL`).

## 3. Pixel do Facebook

- O snippet do Pixel é injetado em `index.html` no `<head>` (PageView automático).
- O `app.js` dispara `fbq('track', 'InitiateCheckout')` no submit do form, antes do redirect.
- Defina o ID do Pixel em `index.html` (procure por `FB_PIXEL_ID`).

## 4. Diferenciação por landing

| Landing | URL | Planilha | Identificador `source` |
|---|---|---|---|
| **v1 verde** (essa) | vetspro-presencial-junho-2026.vercel.app | Leads Presencial — Landing v1 (verde médico) | `landing-v1-verde` |
| **v2 Claude Design** | vetspro-anestesia-presencial.vercel.app | Leads Curso Presencial 27 e 28 de junho | `landing-vetspro-presencial` |
