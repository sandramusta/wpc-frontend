import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CITIES, PARTNERS } from '../data/partners';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  linnad = CITIES;
  edasimuujad = PARTNERS.filter(p => p.tyyp === 'edasimuuja');

  // Lühikesed omadused ribal kohe avapildi all
  checks = ['Mädanemiskindel', 'Pakase- ja rahekindel', 'Puhasta survepesuriga', 'Värv püsib', 'Ei kolise tuulega'];

  // Miks valida: kolm peamist põhjust
  reasons = [
    { title: 'Vastupidavus ja kvaliteet', text: 'WPC ühendab puidu loodusliku ilme ja plasti praktilisuse. TTÜ katses ei muutunud lipid 2000 tunni tugeva UV-valguse järel hapramaks. Garantii 24 kuud.' },
    { title: 'Privaatsus ja turvalisus', text: 'Privaatne hoov kohe, ilma et peaksid aastaid elupuuhekki kasvatama ja pügama. Lipid annavad ka tuuletõkke.' },
    { title: 'Taskukohane lahendus', text: 'Erinevalt puitaiast ei pea värvima ega hooldama, see säästab aega ja raha. Paigaldamisega saab hakkama igaüks, ja kui aega pole, paigaldame meie.' },
  ];

  material = [
    { pct: 60, osa: 'puidukiudu', miks: 'Annavad loodusliku välimuse ja tekstuuri.' },
    { pct: 30, osa: 'kvaliteetset plasti', miks: 'Tagab vastupidavuse.' },
    { pct: 10, osa: 'lisandeid', miks: 'Parandavad UV-kaitset ja ilmastikukindlust.' },
  ];

  // TTÜ katsetulemused (Drive: „TTÜ katselabori tulemused"; tabeli näitamiseks on labori luba)
  labTulemused = [
    { katse: 'Värvimuutus pärast 2000 h UV-kiirgust (ISO 16616)', tulemus: 'ΔE 1,30', tahendus: 'Muutus on vaevu märgatav' },
    { katse: 'Löögitugevus enne / pärast 2000 h UV-kiirgust (Charpy, ISO 179-1)', tulemus: '5,56 / 5,90 kJ/m²', tahendus: 'Päike ei teinud materjali hapramaks' },
    { katse: 'Paindetugevus (EN 310)', tulemus: '34,4 MPa', tahendus: 'Materjali tugevus painutamisel' },
    { katse: 'Elastsusmoodul (EN 310)', tulemus: '4331 MPa', tahendus: 'Materjali jäikus' },
    { katse: 'Tihedus (EN ISO 1183-1)', tulemus: '1,27 g/cm³', tahendus: 'Materjali tihedus' },
    { katse: 'Veeimavus / pundumine 28 päeva vees (EN 317)', tulemus: '8,4 % / 5,45 %', tahendus: 'Kui palju materjal vees olles vett imab ja paisub' },
    { katse: 'Kuumutusjärgne jääkdeformatsioon (EN 479)', tulemus: '−0,21 %', tahendus: 'Väike muutus' },
  ];

  galerii = ['images/tumehall.jpg', 'images/woven.jpg', 'images/two-colors.jpg', 'images/close-up.jpg', 'images/pruun.jpg', 'images/before-after.jpg'];

  // Leia paigaldaja: kliendi asukoht ja selle järgi sorditud paigaldajad
  asukoht = signal<{ lat: number; lng: number } | null>(null);
  asukohaNimi = signal('');
  asukohaViga = signal('');

  lahimad = computed(() => {
    const koht = this.asukoht();
    if (!koht) return [];
    return PARTNERS
      .filter(p => p.tyyp === 'paigaldaja')
      .map(p => ({ ...p, kaugus: Math.round(this.kaugus(koht.lat, koht.lng, p.lat, p.lng)) }))
      .sort((a, b) => a.kaugus - b.kaugus);
  });

  valiLinn(nimi: string) {
    const linn = CITIES.find(l => l.nimi === nimi);
    if (linn) {
      this.asukoht.set({ lat: linn.lat, lng: linn.lng });
      this.asukohaNimi.set(linn.nimi);
      this.asukohaViga.set('');
    }
  }

  minuAsukoht() {
    if (!navigator.geolocation) {
      this.asukohaViga.set('Sinu brauser ei oska asukohta öelda. Vali linn nimekirjast.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.asukoht.set({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        this.asukohaNimi.set('sinu asukoht');
        this.asukohaViga.set('');
      },
      () => this.asukohaViga.set('Asukohta ei saanud. Vali linn nimekirjast.')
    );
  }

  // Kahe punkti vaheline kaugus kilomeetrites (Haversine'i valem)
  private kaugus(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const r = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * r * Math.asin(Math.sqrt(a));
  }
}
