import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Offer } from '../offer/offer';
import { Invoice, Partner, dateEt, euro } from '../partner-types';

// Partneri arved tema klientidele. Arve tehakse projektist nupuga „Loo arve".
@Component({
  selector: 'app-invoices',
  imports: [Offer],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
})
export class Invoices {
  partner = input.required<Partner>();

  private http = inject(HttpClient);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  invoices = signal<Invoice[]>([]);
  open = signal<Invoice | null>(null);

  euro = euro;
  dateEt = dateEt;

  constructor() {
    effect(() => this.load(this.partner().id));
  }

  load(partnerId: number) {
    this.http.get<Invoice[]>(this.apiUrl + "/partners/" + partnerId + "/invoices").subscribe(result => this.invoices.set(result));
  }

  overdue(invoice: Invoice): boolean {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return !invoice.paid && new Date(invoice.dueDate) < today;
  }

  markPaid(invoice: Invoice) {
    this.http.put<Invoice>(this.apiUrl + "/invoices/" + invoice.id + "/paid", {}).subscribe(() => this.load(this.partner().id));
  }
}
