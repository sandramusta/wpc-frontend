# WPC.EE frontend

Angulari rakendus WPC.EE kodulehele, e-poele ja B2B partnerikontole. Backend on eraldi repos [wpc.ee](https://github.com/sandramusta/wpc.ee).

Projekt on IT-kursuse lõputöö ja põhineb kursusel tehtud veebipoe projektil ([veebipood-frontend](https://github.com/sandramusta/veebipood-frontend)).

## Lehed

| Aadress | Kaust | Sisu |
| --- | --- | --- |
| `/` | `home` | Avaleht: eelised, enne ja pärast, TTÜ tulemused, ESTO, „Leia paigaldaja", edasimüüjad, galerii |
| `/e-pood` | `shop` | Toode: kõrgus, värv, kogus, hind, laoseis, ostukorvi lisamine ja päringuvorm |
| `/ostukorv` | `cart` | Ostukorv, tarne, kliendi andmed, makse |
| `/makse` | `payment-result` | Makse tulemus pärast EveryPay'd |
| `/galerii` | `gallery` | Tehtud tööde pildid |
| `/juhendid` | `guides` | Ostu- ja paigaldusjuhend koos videoga |
| `/kkk` | `faq` | Korduma kippuvad küsimused |
| `/edasimuujale` | `resellers` | Miks hakata partneriks ja kandideerimise vorm |
| `/partner` | `partner` | B2B partnerikonto: projektid, pakkumised, arved, tootekataloog, tellimused |
| `/blogi` | `coming-soon` | Valmimisel |
| muu | `not-found` | 404 leht |

Kood (kaustad, failid, klassid) on inglise keeles, lehe tekstid ja aadressid eesti keeles.

## Tehnoloogiad

- Angular 22, standalone komponendid
- `signal`, `computed`, `input()`, `output()`, mallides `@if` ja `@for`
- `HttpClient` backendiga suhtlemiseks
- `@ngx-env/builder` backendi aadressi jaoks (`NG_APP_API_URL`)

## Käivitamine

Vaja on Node.js versiooni 22.22 või uuemat.

```bash
npm install
npm start
```

Ava brauseris **`http://lvh.me:4200`**.

Backend peab töötama aadressil `http://localhost:8080` (vt backendi README). Teise aadressi saab anda keskkonnamuutujaga `NG_APP_API_URL`.

### Miks `lvh.me:4200`, mitte `localhost:4200`

EveryPay ei luba makse järel tagasi suunata `localhost` aadressile. `lvh.me` suunab samuti sinu enda arvutisse, aga EveryPay võtab selle vastu. Selleks on `angular.json`-is `"host": "127.0.0.1"` ja `"allowedHosts": ["lvh.me"]`.

Kasuta algusest lõpuni sama aadressi. Ostukorv on brauseri `localStorage`'is ja see on iga aadressi jaoks eraldi.

## Kaustad

```
src/
  styles.css          brändi värvid, kirjasuurused (--fs-body jne), jalus, prindireeglid
  app/
    app.routes.ts     aadressid ja nende komponendid
    menu/             päis ja menüü (telefonis ☰)
    services/cart.ts  ostukorv (localStorage, võti wpc-cart)
    models/           Product, ProductVariant, Category
    data/partners.ts  paigaldajad ja edasimüüjad avalehel
    partner/          partnerikonto ja selle osad:
      projects/       projektid ja projekti vorm
      offer/          hinnapakkumine ja arve (prinditav, A4)
      invoice-form/   arve koostamise aken
      invoices/       arvete nimekiri
      profile/        ettevõtte andmed, logo, tunnihind
public/
  images/             pildid (images/guide juhendi pildid, images/team meeskond)
  partners/           edasimüüjate logod
  logo.png, wpc-icon.png
```

## Ehitamine

```bash
npm run build
```

Valmis failid tulevad kausta `dist/wpc-frontend/browser`.
