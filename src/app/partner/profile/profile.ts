import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Partner } from '../partner-types';

// Partneri ettevõtte andmed ja logo. Need lähevad automaatselt tema hinnapakkumistele.
@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  partner = input.required<Partner>();
  saved = output<Partner>();

  private http = inject(HttpClient);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  form: Partial<Partner> = {};
  message = signal('');
  error = signal('');

  constructor() {
    // Vormi täidame partneri praeguste andmetega
    effect(() => {
      const p = this.partner();
      this.form = {
        company: p.company, companyRegCode: p.companyRegCode, vatNumber: p.vatNumber,
        companyAddress: p.companyAddress, website: p.website, bankName: p.bankName,
        bankAccount: p.bankAccount, phone: p.phone, email: p.email, logo: p.logo,
        installationHourlyRate: p.installationHourlyRate, installationHoursPerKit: p.installationHoursPerKit
      };
    });
  }

  // Logo loetakse pildiks tekstikujul (data:image/...), et selle saaks andmebaasi salvestada
  onLogo(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.error.set('Logo peab olema pilt (PNG, JPG või SVG).');
      return;
    }
    if (file.size > 500 * 1024) {
      this.error.set('Logo on liiga suur. Maksimaalselt 500 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.form.logo = reader.result as string;
      this.error.set('');
    };
    reader.readAsDataURL(file);
  }

  removeLogo() {
    this.form.logo = null;
  }

  save() {
    this.message.set('');
    this.error.set('');
    this.http.put<Partner>(this.apiUrl + "/partners/" + this.partner().id + "/profile", this.form).subscribe({
      next: partner => {
        this.message.set('Andmed salvestatud. Need on nüüd kõigil sinu hinnapakkumistel.');
        this.saved.emit(partner);
      },
      error: () => this.error.set('Salvestamine ei õnnestunud.')
    });
  }
}
