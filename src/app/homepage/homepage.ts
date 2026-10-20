import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Product } from '../models/Product';
import { ProductVariant } from '../models/ProductVariant';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  product: Product | null = null;
  selectedHeight = 1530; // kõige populaarsem kõrgus on vaikimisi valitud
  selectedColor = 'tumehall';
  quantity = 8;
  slats = new Array(14); // joonise lipid, ainult välimuse jaoks
  colorHex: { [color: string]: string } = { tumehall: '#3E4448', pruun: '#6E5442' };

  private http = inject(HttpClient);
  private detectChange = inject(ChangeDetectorRef);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  ngOnInit() {
    this.http.get<Product[]>(this.apiUrl + "/products").subscribe(result => {
      this.product = result.length > 0 ? result[0] : null;
      this.detectChange.detectChanges();
    });
  }

  // Kõik erinevad kõrgused variantidest, väiksemast suuremani
  heights(): number[] {
    if (!this.product) return [];
    const all = this.product.variants.map(v => v.lengthMm);
    return [...new Set(all)].sort((a, b) => a - b);
  }

  // Variant, mis vastab valitud kõrgusele ja värvile
  selectedVariant(): ProductVariant | undefined {
    return this.product?.variants.find(v => v.lengthMm === this.selectedHeight && v.color === this.selectedColor);
  }

  selectHeight(height: number) {
    this.selectedHeight = height;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  changeQuantity(change: number) {
    this.quantity = Math.max(1, this.quantity + change);
  }

  total(): number {
    const variant = this.selectedVariant();
    return variant ? variant.price * this.quantity : 0;
  }

  totalWeight(): number {
    const variant = this.selectedVariant();
    return variant ? Math.round(variant.weightKg * this.quantity) : 0;
  }

  // 1 komplekt = 1 paneel = 2,5 m aeda
  fenceLength(): string {
    return (this.quantity * 2.5).toString().replace('.', ',') + ' m';
  }

  stockText(): string {
    const variant = this.selectedVariant();
    if (!variant) return 'Sellist varianti ei ole';
    if (variant.stock >= this.quantity) return 'Laos';
    if (variant.stock > 0) return 'Laos ' + variant.stock + ' komplekti, ülejäänu tarneaeg kuni paar kuud';
    return 'Ootab kaupa, tarneaeg kuni paar kuud';
  }

  heightLabel(mm: number): string {
    return (mm / 1000).toFixed(2).replace('.', ',') + ' m';
  }

  euro(amount: number): string {
    return amount.toFixed(2).replace('.', ',') + ' €';
  }

  slatHeight(): number {
    return Math.round(this.selectedHeight / 1930 * 300);
  }
}