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
      <a routerLink="/e-pood" fragment="paring" class="btn">Küsi meilt</a>
    </section>
  `,
  styles: `.soon { text-align: center; padding: 64px 24px 96px; }`,
})
export class Tulekul {
  private data = inject(ActivatedRoute).snapshot.data;
  title = this.data['title'];
  text = this.data['text'] ?? 'See leht on valmimisel.';
}
