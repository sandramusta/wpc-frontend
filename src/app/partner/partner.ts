import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/Product';
import { ProductVariant } from '../models/ProductVariant';
import { Partner } from './partner-types';
import { Projects } from './projects/projects';
import { Profile } from './profile/profile';
import { Invoices } from './invoices/invoices';

type PartnerOrder = {
  id: number;
  total: number;
  createdAt: string;
  orderType: string;
  paymentState: string;
  items: { quantity: number; priceAtOrder: number; variant: ProductVariant }[];
};

// B2B partneri vaade. DEMO: päris kontos logib partner sisse,
// siin valitakse partner nimekirjast, et vaadet saaks näidata.
@Component({
  selector: 'app-partner',
  imports: [FormsModule, Projects, Profile, Invoices],
  templateUrl: './partner.html',
  styleUrl: './partner.css',
})
export class PartnerPage {
  private http = inject(HttpClient);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  // Uuele tasemele saab partner, kui aasta ostumaht ületab selle summa
  readonly NEXT_LEVEL_AMOUNT = 5000;

  partners = signal<Partner[]>([]);
  partner = signal<Partner | null>(null);
  tab = signal<'projektid' | 'arved' | 'tellimine' | 'tellimused' | 'materjalid' | 'andmed'>('projektid');
  product = signal<Product | null>(null);
  orders = signal<PartnerOrder[]>([]);
  quantities: { [variantId: number]: number } = {};
  message = signal('');
  error = signal('');
  sending = signal(false);

  materials = [
    { src: 'images/tumehall.jpg', name: 'Tumehall lähedalt' },
    { src: 'images/pruun.jpg', name: 'Pruun lähedalt' },
    { src: 'images/woven.jpg', name: 'Punutud stiil' },
    { src: 'images/before-after.jpg', name: 'Enne ja pärast' },
    { src: 'images/two-colors.jpg', name: 'Kaks värvi' },
    { src: 'images/hero.jpg', name: 'Aed uusarenduses' },
  ];

  // Variandid kõrguse ja värvi järgi järjestatud
  variants = computed(() => {
    const p = this.product();
    if (!p) return [];
    return [...p.variants].sort((a, b) => a.lengthMm - b.lengthMm || a.color.localeCompare(b.color));
  });

  // Viimase 12 kuu ostud, mis ei ole ebaõnnestunud
  yearTotal = computed(() => {
    const yearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    return this.orders()
      .filter(o => o.orderType === 'PURCHASE' && !['FAILED', 'ABANDONED', 'VOIDED'].includes(o.paymentState))
      .filter(o => new Date(o.createdAt).getTime() > yearAgo)
      .reduce((sum, o) => sum + o.total, 0);
  });

  progressPercent = computed(() => Math.min(100, Math.round(this.yearTotal() / this.NEXT_LEVEL_AMOUNT * 100)));

  constructor() {
    this.http.get<Partner[]>(this.apiUrl + "/partners").subscribe(result => this.partners.set(result));
    this.loadProduct();
  }

  selectPartner(id: string) {
    const partner = this.partners().find(p => p.id === Number(id)) ?? null;
    this.partner.set(partner);
    this.quantities = {};
    this.message.set('');
    this.error.set('');
    if (partner) {
      this.loadOrders(partner.id);
    }
  }

  // Kui partner salvestas oma andmed, uuendame need ka siin
  onProfileSaved(updated: Partner) {
    this.partner.set(updated);
    this.partners.update(list => list.map(p => p.id === updated.id ? updated : p));
  }

  // Projektist tehti tellimus: uuendame tellimuste ajalugu ja laoseisu
  onProjectOrdered() {
    const p = this.partner();
    if (p) this.loadOrders(p.id);
    this.loadProduct();
  }

  partnerPrice(price: number): number {
    const discount = this.partner()?.discountPercent ?? 0;
    return Math.round(price * (100 - discount)) / 100;
  }

  levelName(level: string): string {
    return level === 'PRO' ? 'Pro' : 'Partner';
  }

  orderTotal(): number {
    return this.variants().reduce((sum, v) => sum + this.partnerPrice(v.price) * (this.quantities[v.id] || 0), 0);
  }

  stateText(state: string): string {
    if (state === 'SETTLED') return 'Makstud';
    if (state === 'INITIAL') return 'Ootab makset';
    return 'Tühistatud';
  }

  submitOrder() {
    const partner = this.partner();
    const items = this.variants()
      .filter(v => (this.quantities[v.id] || 0) > 0)
      .map(v => ({ variantId: v.id, quantity: this.quantities[v.id] }));
    if (!partner || items.length === 0) {
      this.error.set('Vali vähemalt ühe toote kogus.');
      return;
    }
    this.sending.set(true);
    this.error.set('');
    // Partneri tellimus: backend arvutab partneri hinna ise, frontendi hinda ei usaldata
    this.http.post<{ id: number }>(this.apiUrl + "/orders", { personId: partner.id, orderType: 'PURCHASE', source: 'partner', items }).subscribe({
      next: saved => {
        this.sending.set(false);
        this.quantities = {};
        this.message.set('Tellimus nr ' + saved.id + ' on vastu võetud. Saadame arve e-postiga.');
        this.loadOrders(partner.id);
        this.loadProduct();
      },
      error: () => {
        this.sending.set(false);
        this.error.set('Tellimust ei õnnestunud saata. Võib-olla pole mõnda toodet nii palju laos.');
      }
    });
  }

  heightLabel(mm: number): string {
    return (mm / 1000).toFixed(2).replace('.', ',') + ' m';
  }

  euro(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + ' €';
  }

  date(value: string): string {
    return new Date(value).toLocaleDateString('et-EE');
  }

  private loadProduct() {
    this.http.get<Product[]>(this.apiUrl + "/products").subscribe(result => this.product.set(result[0] ?? null));
  }

  private loadOrders(personId: number) {
    this.http.get<PartnerOrder[]>(this.apiUrl + "/my-orders/" + personId).subscribe(result =>
      this.orders.set(result.sort((a, b) => b.id - a.id)));
  }
}
