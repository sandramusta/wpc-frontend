import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../services/cart';

// Leht, kuhu EveryPay kliendi pärast maksmist tagasi saadab.
// Aadressis on payment_reference, mille järgi küsime backendilt makse tulemust.
@Component({
    selector: 'app-makse',
    imports: [RouterLink],
    templateUrl: './makse.html',
    styleUrl: './makse.css',
})
export class Makse {
    private http = inject(HttpClient);
    private cart = inject(CartService);
    private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

    // 'loading' | 'SETTLED' | 'FAILED' | 'ABANDONED' | 'VOIDED' | 'INITIAL' | 'error'
    state = signal('loading');
    orderId = signal<number | null>(null);

    constructor() {
        const reference = inject(ActivatedRoute).snapshot.queryParamMap.get('payment_reference');
        if (!reference) {
            this.state.set('error');
            return;
        }
        this.http.get<{ id: number; paymentState: string }>(this.apiUrl + "/check-payment?paymentReference=" + reference).subscribe({
            next: order => {
                this.orderId.set(order.id);
                this.state.set(order.paymentState);
                if (order.paymentState === 'SETTLED') {
                    this.cart.clear(); // makse õnnestus, ostukorv tühjaks
                }
            },
            error: () => this.state.set('error')
        });
    }
}