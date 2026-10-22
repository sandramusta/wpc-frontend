import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Paigaldusvideo YouTube'ist. Kasutatakse Juhendite lehel ja e-poes.
// VIDEO_ID: YouTube'i lingi lõpuosa, nt lingis https://www.youtube.com/watch?v=abc123XYZ on see abc123XYZ.
const VIDEO_ID = 'L73u6NY4fh8';

@Component({
  selector: 'app-install-video',
  template: `
    @if (url) {
      <div class="video">
        <iframe [src]="url" title="WPC aialippide paigaldusvideo" loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    } @else {
      <div class="video video-empty">Siia tuleb paigaldusvideo</div>
    }
  `,
  styles: `
    .video { position: relative; aspect-ratio: 16 / 9; border-radius: 24px; overflow: hidden; background: #000; box-shadow: 0 30px 60px rgba(50, 63, 68, 0.25); }
    .video iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
    .video-empty { display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 20px; background: var(--wpc-tume); }
  `,
})
export class InstallVideo {
  // Angular ei luba turvalisuse pärast suvalist aadressi iframe'i panna.
  // bypassSecurityTrustResourceUrl ütleb, et seda ühte YouTube'i aadressi usaldame.
  // youtube-nocookie.com ei pane küpsiseid enne, kui klient video käivitab.
  url: SafeResourceUrl | null = VIDEO_ID
    ? inject(DomSanitizer).bypassSecurityTrustResourceUrl('https://www.youtube-nocookie.com/embed/' + VIDEO_ID + '?rel=0')
    : null;
}
