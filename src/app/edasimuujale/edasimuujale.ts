import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Edasimüüjate ja paigaldajate leht: miks hakata partneriks, mida partnerikonto annab ja kandideerimise vorm
@Component({
  selector: 'app-edasimuujale',
  imports: [FormsModule, RouterLink],
  templateUrl: './edasimuujale.html',
  styleUrl: './edasimuujale.css',
})
export class Edasimuujale {
  private http = inject(HttpClient);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  // Miks WPC aialipid on hea toode, mida müüa (faktid failist teenused.md)
  productReasons = [
    { title: 'Eestis ainsana', text: 'Oleme Eestis esimesed ja ainsad, kes vertikaalseid WPC aialippe 3D paneelaedadele müüvad. Sinu kliendid ei leia seda toodet igalt poolt.' },
    { title: 'Lisamüük igale paneelaiale', text: 'Lipid sobivad ka olemasolevale 3D paneelaiale. Iga paneelaia objekt on võimalus pakkuda kliendile privaatsust juurde.' },
    { title: 'Kiire paigaldada', text: 'Ühe 2,5 m paneeli katmine võtab 30–45 minutit ja eritööriistu pole vaja. Punutud paigaldus on eriline lahendus, mille eest saab küsida rohkem.' },
    { title: 'Hooldusvaba', text: 'Ei vaja värvimist ega peitsimist, ei mädane ega purune pakase käes. Rahulolev klient ei helista sulle kaebusega.' },
    { title: 'Testitud TalTechis', text: '2000 tundi UV-kiirgust muutis värvi vaid ΔE 1,3 võrra ja materjal ei muutunud hapramaks. Tulemused saad kliendile näidata.' },
    { title: '24 kuud garantii', text: 'Toote garantii on 24 kuud alates üleandmisest. Pretensioonidega tegeleme meie.' },
  ];

  // Mida partner saab
  benefits = [
    { big: '−10%', title: 'Partnerhind', text: 'Kõik tooted partnerihinnaga kohe esimesest tellimusest.' },
    { big: '−15%', title: 'Pro tase', text: 'Kui aasta ostumaht ületab 5 000 €, saad Pro taseme ja suurema allahindluse.' },
    { big: '+€', title: 'Tulu paigaldusest', text: 'Lisaks materjali marginaalile teenid paigaldustöölt. Hinna määrad ise.' },
    { big: '📦', title: 'Kaup laost', text: 'Laos olev kaup kohe. Järgi Haaslavast või kohale Venipakiga.' },
  ];

  // Partnerikonto võimalused
  features = [
    { title: 'Hinnapakkumine sinu logoga', text: 'Lisa kliendi projekt ja materjalid. Süsteem teeb valmis hinnapakkumise sinu ettevõtte logo ja andmetega, mille saad kohe PDF-ina saata.' },
    { title: 'Laoseis ja tarneaeg reaalajas', text: 'Näed kohe, mis on laos. Kui mõnda toodet pole, on pakkumisel märge koos eeldatava tarnekuupäevaga.' },
    { title: 'Paigalduse hind arvutatakse ise', text: 'Määra oma tunnihind korra ära. Iga projekti paigalduse hind arvutatakse komplektide arvu järgi, vajadusel muudad käsitsi.' },
    { title: 'Tellimine ühe nupuga', text: 'Kui klient kinnitab pakkumise, tellid materjalid ühe nupuvajutusega partnerihinnaga.' },
    { title: 'Arve kliendile', text: 'Kinnitatud projektist koostad kliendile arve. Arved on kontos koos ja näed, mis on makstud.' },
    { title: 'Paigaldustähtajad silme ees', text: 'Iga projekti juures on paigalduse tähtaeg ja mitu päeva on jäänud, et miski ei ununeks.' },
    { title: 'Tellimuste ajalugu ja tase', text: 'Kõik tellimused ühes kohas ja näed, kui palju on Pro tasemeni jäänud.' },
    { title: 'Turundusmaterjalid', text: 'Pildid ja materjalid oma kodulehe ja sotsiaalmeedia jaoks, alla laadimiseks valmis.' },
  ];

  steps = [
    { title: 'Võta ühendust', text: 'Täida allolev vorm või helista. Räägime läbi, kuidas koostöö käib.' },
    { title: 'Avame sulle konto', text: 'Saad partnerikonto, partnerihinnad ja turundusmaterjalid.' },
    { title: 'Tee esimene pakkumine', text: 'Lisa oma kliendi projekt ja saada talle hinnapakkumine juba samal päeval.' },
  ];

  // Kandideerimise vorm
  company = '';
  name = '';
  email = '';
  phone = '';
  message = '';
  sending = signal(false);
  sent = signal(false);
  error = signal('');

  apply() {
    if (!this.company || !this.name || !this.email) {
      this.error.set('Palun kirjuta ettevõtte nimi, oma nimi ja e-post.');
      return;
    }
    // Saadame päringuna, nagu e-poe päringuvorm. Tooteid pole, sõnumis on ettevõtte nimi.
    const [firstName, ...rest] = this.name.trim().split(' ');
    const body = {
      orderType: 'INQUIRY',
      source: 'edasimuujale',
      message: 'Soovib partneriks: ' + this.company + (this.message ? '. ' + this.message : ''),
      firstName, lastName: rest.join(' '), email: this.email, phone: this.phone,
      items: []
    };
    this.sending.set(true);
    this.error.set('');
    this.http.post(this.apiUrl + "/orders", body).subscribe({
      next: () => { this.sending.set(false); this.sent.set(true); },
      error: () => { this.sending.set(false); this.error.set('Saatmine ei õnnestunud. Proovi uuesti või kirjuta info@wpc.ee.'); }
    });
  }
}
