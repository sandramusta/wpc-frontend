import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Product } from '../models/Product';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  products: Product[] = [];
  private http = inject(HttpClient);
  private detectChange = inject(ChangeDetectorRef);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  ngOnInit() {
    this.http.get<Product[]>(this.apiUrl + "/products").subscribe(result => {
      this.products = result;
      this.detectChange.detectChanges();
    });
  }
}