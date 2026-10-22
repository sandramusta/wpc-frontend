import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Invoice, InvoiceLine, Partner, Project, VAT, euro, round2 } from '../partner-types';

// Arve koostamise aken. Read tulevad projektist, aga enne arve tegemist saab partner
// ridu, hindu, allahindlust ja maksetähtaega muuta.
@Component({
  selector: 'app-arve-vorm',
  imports: [FormsModule],
  templateUrl: './arve-vorm.html',
  styleUrl: './arve-vorm.css',
})
export class ArveVorm implements OnInit {
  project = input.required<Project>();
  partner = input.required<Partner>();
  created = output<Invoice>();
  close = output<void>();

  private http = inject(HttpClient);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  lines: InvoiceLine[] = [];
  discountPercent = 0;
  dueDate = '';
  today = this.isoDate(new Date());
  error = signal('');
  sending = signal(false);

  euro = euro;
  round2 = round2;

  ngOnInit() {
    const p = this.project();
    // Tooted projektist. Ühiku hind ilma KM-ta jäetakse ümardamata, siis klapib rea summa pakkumisega sendi pealt.
    this.lines = p.items.map(i => ({
      name: 'WPC aialippide komplekt',
      lengthMm: i.variant.lengthMm,
      color: i.variant.color,
      quantity: i.quantity,
      weightKg: i.variant.weightKg,
      unitPrice: i.variant.price / (1 + VAT),
    }));
    if (p.installationPrice > 0) {
      this.lines.push({ name: 'Paigaldustöö', lengthMm: null, color: '', quantity: 1, weightKg: null, unitPrice: p.installationPrice });
    }
    this.discountPercent = p.discountPercent || 0;
    const due = new Date();
    due.setDate(due.getDate() + 7); // vaikimisi maksetähtaeg 7 päeva
    this.dueDate = this.isoDate(due);
  }

  addLine() {
    this.lines.push({ name: '', lengthMm: null, color: '', quantity: 1, weightKg: null, unitPrice: 0 });
  }

  removeLine(index: number) {
    this.lines.splice(index, 1);
  }

  lineTotal(line: InvoiceLine): number {
    return round2((line.unitPrice || 0) * (line.quantity || 0));
  }

  // Samad arvutused teeb ka backend, see on ainult eelvaateks
  totals() {
    const total = round2(this.lines.reduce((sum, l) => sum + this.lineTotal(l), 0));
    const discount = round2(total * (this.discountPercent || 0) / 100);
    const subtotal = round2(total - discount);
    const vat = round2(subtotal * VAT);
    return { total, discount, subtotal, vat, grandTotal: round2(subtotal + vat) };
  }

  submit() {
    this.error.set('');
    if (this.lines.length === 0 || this.lines.some(l => !l.name || !(l.quantity > 0) || l.unitPrice < 0)) {
      this.error.set('Igal real peab olema nimetus, kogus vähemalt 1 ja hind.');
      return;
    }
    if (!this.dueDate || this.dueDate < this.today) {
      this.error.set('Maksetähtaeg ei saa olla minevikus.');
      return;
    }
    this.sending.set(true);
    const body = { dueDate: this.dueDate, discountPercent: this.discountPercent || 0, lines: this.lines };
    this.http.post<Invoice>(this.apiUrl + "/projects/" + this.project().id + "/invoice", body).subscribe({
      next: invoice => {
        this.sending.set(false);
        this.created.emit(invoice);
      },
      error: () => {
        this.sending.set(false);
        this.error.set('Arvet ei õnnestunud koostada.');
      }
    });
  }

  // Kuupäev kujul "2026-10-28", nagu <input type="date"> seda ootab
  private isoDate(d: Date): string {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
}
