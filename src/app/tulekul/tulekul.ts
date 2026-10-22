import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

// Üks komponent lehtedele, mille sisu tuleb hiljem (Juhendid, Blogi, Edasimüüjale).
// Pealkiri ja tekst tulevad app.routes.ts failist.
@Component({
  selector: 'app-tulekul',
  imports: [RouterLink],
  template: `
    <section class="page-hero">
      <h1>{{ title }}</h1>
      <p>{{ text }}</p>
    </section>
    <section class="soon">
      @if (partnerLink) {
        <a routerLink="/partner" class="btn">Ava partnerikonto</a>
      }
      <a routerLink="/e-pood" fragment="paring" class="btn">Küsi meilt</a>
    </section>
  `,
  styles: `.soon { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding: 64px 24px 96px; }`,
})
export class Tulekul {
  private data = inject(ActivatedRoute).snapshot.data;
  title = this.data['title'];
  text = this.data['text'] ?? 'See leht on valmimisel.';
  partnerLink = this.data['partnerLink'] ?? false;
}
