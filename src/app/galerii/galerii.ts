import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-galerii',
  imports: [],
  templateUrl: './galerii.html',
  styleUrl: './galerii.css',
})
export class Galerii {
  pildid = [
    { src: 'pildid/hero.jpg', tekst: 'Pruun, uusarenduse hoov' },
    { src: 'pildid/tumehall.jpg', tekst: 'Tumehall lähedalt' },
    { src: 'pildid/punutud.jpg', tekst: 'Punutud stiil, pruun' },
    { src: 'pildid/pruun.jpg', tekst: 'Pruun lähedalt' },
    { src: 'pildid/kaks-varvi.jpg', tekst: 'Tumehall ja pruun kõrvuti' },
    { src: 'pildid/enne-parast.jpg', tekst: 'Enne ja pärast' },
    { src: 'pildid/lahedalt.jpg', tekst: 'Lipid ja profiil' },
  ];

  // Pilt, mis on suurelt lahti (null = ükski)
  avatud = signal<{ src: string; tekst: string } | null>(null);
}
