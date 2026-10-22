import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  pildid = [
    { src: 'images/hero.jpg', tekst: 'Pruun, uusarenduse hoov' },
    { src: 'images/tumehall.jpg', tekst: 'Tumehall lähedalt' },
    { src: 'images/woven.jpg', tekst: 'Punutud stiil, pruun' },
    { src: 'images/pruun.jpg', tekst: 'Pruun lähedalt' },
    { src: 'images/two-colors.jpg', tekst: 'Tumehall ja pruun kõrvuti' },
    { src: 'images/before-after.jpg', tekst: 'Enne ja pärast' },
    { src: 'images/close-up.jpg', tekst: 'Lipid ja profiil' },
  ];

  // Pilt, mis on suurelt lahti (null = ükski)
  avatud = signal<{ src: string; tekst: string } | null>(null);
}
