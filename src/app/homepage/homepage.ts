import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/Product';
import { ProductVariant } from '../models/ProductVariant';
import { CartService } from '../services/cart';
import { PaigaldusVideo } from '../paigaldus-video/paigaldus-video';

@Component({
  selector: 'app-homepage',
  imports: [FormsModule, PaigaldusVideo],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  product: Product | null = null;
  selectedHeight = 1530;
  selectedColor = 'tumehall';
  quantity = 8;
  colorHex: { [color: string]: string } = { tumehall: '#3E4448', pruun: '#6E5442' };
  colorImage: { [color: string]: string } = { tumehall: 'pildid/tumehall.jpg', pruun: 'pildid/pruun.jpg' };
  gallery = ['pildid/lahedalt.jpg', 'pildid/punutud.jpg', 'pildid/enne-parast.jpg', 'pildid/kaks-varvi.jpg'];
  activeImage: string | null = null;
  addedMessage = '';
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  message = '';
  sending = false;
  sent = false;
  error = '';

  private http = inject(HttpClient);
  private detectChange = inject(ChangeDetectorRef);
  private cart = inject(CartService);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  ngOnInit() {
    this.rememberSource();
    this.http.get<Product[]>(this.apiUrl + "/products").subscribe(result => {
      this.product = result.length > 0 ? result[0] : null;
      this.detectChange.detectChanges();
    });
  }

  rememberSource() {
    const source = new URLSearchParams(window.location.search).get('utm_source');
    if (source) {
      sessionStorage.setItem('source', source);
    }
  }

  heights(): number[] {
    if (!this.product) return [];
    const all = this.product.variants.map(v => v.lengthMm);
    return [...new Set(all)].sort((a, b) => a - b);
  }

  selectedVariant(): ProductVariant | undefined {
    return this.product?.variants.find(v => v.lengthMm === this.selectedHeight && v.color === this.selectedColor);
  }

  selectHeight(height: number) { this.selectedHeight = height; this.addedMessage = ''; }
  selectColor(color: string) { this.selectedColor = color; this.activeImage = null; this.addedMessage = ''; }
  mainImage(): string { return this.activeImage ?? this.colorImage[this.selectedColor]; }
  changeQuantity(change: number) { this.quantity = Math.max(1, this.quantity + change); }

  addToCart() {
    const variant = this.selectedVariant();
    if (!variant || !this.product) return;
    this.cart.add({ variantId: variant.id, name: this.product.name, heightMm: variant.lengthMm, color: variant.color, price: variant.price, quantity: this.quantity });
    this.addedMessage = 'Lisatud ostukorvi: ' + this.quantity + ' komplekti, ' + this.heightLabel(variant.lengthMm) + ', ' + variant.color;
  }

  total(): number { const v = this.selectedVariant(); return v ? v.price * this.quantity : 0; }
  totalWeight(): number { const v = this.selectedVariant(); return v ? Math.round(v.weightKg * this.quantity) : 0; }
  fenceLength(): string { return (this.quantity * 2.5).toString().replace('.', ',') + ' m'; }

  stockText(): string {
    const variant = this.selectedVariant();
    if (!variant) return 'Sellist varianti ei ole';
    if (variant.stock >= this.quantity) return 'Laos';
    if (variant.stock > 0) return 'Laos ' + variant.stock + ' komplekti, ülejäänu tarneaeg kuni paar kuud';
    return 'Ootab kaupa, tarneaeg kuni paar kuud';
  }

  heightLabel(mm: number): string { return (mm / 1000).toFixed(2).replace('.', ',') + ' m'; }
  euro(amount: number): string { return amount.toFixed(2).replace('.', ',') + ' €'; }

  submitInquiry() {
    const variant = this.selectedVariant();
    if (!this.firstName || !this.email) { this.error = 'Palun kirjuta oma nimi ja e-post.'; return; }
    if (!variant) { this.error = 'Vali kõrgus ja värv.'; return; }
    const inquiry = {
      orderType: 'INQUIRY',
      source: sessionStorage.getItem('source') ?? 'otse',
      message: this.message, firstName: this.firstName, lastName: this.lastName, email: this.email, phone: this.phone,
      items: [{ variantId: variant.id, quantity: this.quantity }]
    };
    this.sending = true;
    this.error = '';
    this.http.post(this.apiUrl + "/orders", inquiry).subscribe({
      next: () => { this.sending = false; this.sent = true; this.detectChange.detectChanges(); },
      error: () => { this.sending = false; this.error = 'Päringu saatmine ei õnnestunud. Proovi uuesti või kirjuta info@wpc.ee.'; this.detectChange.detectChanges(); }
    });
  }
}
