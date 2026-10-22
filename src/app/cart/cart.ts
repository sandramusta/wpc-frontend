import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-cart',
  imports: [FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cart = inject(CartService);
  private http = inject(HttpClient);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  // Tellija andmed
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  delivery = 'venipak'; // 'venipak' või 'jarele'
  address = '';
  message = '';

  sending = signal(false);
  error = signal('');
  orderId = signal<number | null>(null); // täidetakse, kui tellimus õnnestus

  heightLabel(mm: number): string {
    return (mm / 1000).toFixed(2).replace('.', ',') + ' m';
  }

  euro(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + ' €';
  }

  submitOrder() {
    if (!this.firstName || !this.email || !this.phone) {
      this.error.set('Palun täida nimi, e-post ja telefon.');
      return;
    }
    if (this.delivery === 'venipak' && !this.address) {
      this.error.set('Palun kirjuta tarneaadress.');
      return;
    }

    // Backendis pole veel eraldi tarneaadressi välja, seega läheb tarneinfo sõnumi sisse
    const tarne = this.delivery === 'venipak'
      ? 'Tarne Venipakiga: ' + this.address
      : 'Tulen ise järele Haaslavast';

    const order = {
      orderType: 'PURCHASE',
      source: sessionStorage.getItem('source') ?? 'otse',
      message: tarne + (this.message ? '\n' + this.message : ''),
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      items: this.cart.items().map(item => ({ variantId: item.variantId, quantity: item.quantity }))
    };

    this.sending.set(true);
    this.error.set('');
    // 1. Salvestame tellimuse, 2. küsime EveryPaylt makselingi, 3. suuname kliendi maksma
    this.http.post<{ id: number }>(this.apiUrl + "/orders", order).subscribe({
      next: saved => {
        // Ostukorvi ei tühjenda siin: see tühjeneb alles siis, kui makse on õnnestunud (makse leht)
        this.goToPayment(saved.id);
      },
      error: () => {
        this.sending.set(false);
        this.error.set('Tellimust ei õnnestunud saata. Võib-olla pole mõnda toodet nii palju laos. Proovi väiksema kogusega või kirjuta info@wpc.ee.');
      }
    });
  }

  // Uus katse maksta sama tellimust, kui makselehte ei õnnestunud avada
  retryPayment() {
    const id = this.orderId();
    if (id) {
      this.sending.set(true);
      this.goToPayment(id);
    }
  }

  private goToPayment(orderId: number) {
    this.http.post<{ link: string }>(this.apiUrl + "/orders/" + orderId + "/payment", {}).subscribe({
      next: payment => {
        window.location.href = payment.link; // EveryPay makseleht
      },
      error: () => {
        // Tellimus on salvestatud, aga makselehte ei saanud avada
        this.sending.set(false);
        this.orderId.set(orderId);
      }
    });
  }
}
