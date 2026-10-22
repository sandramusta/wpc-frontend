import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductVariant } from '../../models/ProductVariant';
import { InvoiceForm } from '../invoice-form/invoice-form';
import { Offer } from '../offer/offer';
import { Invoice, Partner, Project, dateEt, euro, heightLabel, installationFromRate, offerTotals } from '../partner-types';

type NewItem = { variantId: number | null; quantity: number };

// Partneri projektid: klient, objekt, materjalid, paigalduse tähtaeg, pakkumine, tellimine ja arve
@Component({
  selector: 'app-projects',
  imports: [FormsModule, Offer, InvoiceForm],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  partner = input.required<Partner>();
  variants = input.required<ProductVariant[]>();
  ordered = output<void>(); // teatab partneri lehele, et tellimus tehti

  private http = inject(HttpClient);
  private apiUrl = import.meta.env.NG_APP_API_URL ? import.meta.env.NG_APP_API_URL : "http://localhost:8080";

  projects = signal<Project[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null); // null = uus projekt, muidu muudetava projekti id
  offerProject = signal<Project | null>(null);
  invoice = signal<Invoice | null>(null);
  invoiceProject = signal<Project | null>(null); // projekt, millele arvet parasjagu koostatakse
  toast = signal(''); // roheline teade ekraani all, kaob ise ära
  error = signal('');
  message = signal('');

  // Projekti vorm (sama vorm uue projekti ja muutmise jaoks)
  clientName = '';
  clientPhone = '';
  clientEmail = '';
  address = '';
  installDate = '';
  notes = '';
  installationManual = false;
  installationPrice = 0;
  discountPercent = 0;
  items: NewItem[] = [{ variantId: null, quantity: 1 }];

  euro = euro;
  dateEt = dateEt;
  heightLabel = heightLabel;
  offerTotals = offerTotals;

  constructor() {
    // Kui partner vahetub, laeme tema projektid
    effect(() => this.load(this.partner().id));
  }

  load(partnerId: number) {
    this.http.get<Project[]>(this.apiUrl + "/partners/" + partnerId + "/projects").subscribe(result => this.projects.set(result));
  }

  addItem() {
    this.items.push({ variantId: null, quantity: 1 });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  variantLabel(v: ProductVariant): string {
    return heightLabel(v.lengthMm) + ' ' + v.color;
  }

  // Variandi praegune laoseis (variants tuleb partneri lehelt ja uueneb pärast igat tellimust)
  variantById(id: number | null): ProductVariant | undefined {
    return this.variants().find(v => v.id === id);
  }

  // Kas kõiki projekti materjale on laos piisavalt? Kui ei, siis tellida ei saa.
  canOrder(project: Project): boolean {
    return project.items.every(i => (this.variantById(i.variant.id)?.stock ?? 0) >= i.quantity);
  }

  itemInStock(variantId: number, quantity: number): boolean {
    return (this.variantById(variantId)?.stock ?? 0) >= quantity;
  }

  // Komplekte vormis kokku, sellest sõltub paigalduse hind
  kitsInForm(): number {
    return this.items.filter(i => i.variantId).reduce((sum, i) => sum + (i.quantity || 0), 0);
  }

  // Paigalduse hind partneri tunnihinnast (näidatakse vormis, backend arvutab sama asja)
  calculatedInstallation(): number {
    return installationFromRate(this.partner(), this.kitsInForm());
  }

  hoursPerKit(): string {
    return String(this.partner().installationHoursPerKit ?? 1).replace('.', ',');
  }

  // Projekti saab muuta, kuni materjale pole tellitud ja arvet pole tehtud
  canEdit(project: Project): boolean {
    return project.status !== 'ORDERED' && !project.invoiceId;
  }

  // Mitu päeva on paigalduseni (negatiivne = tähtaeg möödas)
  daysLeft(date: string): number {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.round((new Date(date).getTime() - today.getTime()) / 86400000);
  }

  statusText(status: string): string {
    if (status === 'OFFER') return 'Pakkumine saadetud';
    if (status === 'CONFIRMED') return 'Klient kinnitas';
    return 'Tellitud';
  }

  newProject() {
    this.resetForm();
    this.message.set('');
    this.showForm.set(true);
  }

  // Täidame vormi olemasoleva projekti andmetega
  edit(project: Project) {
    this.editingId.set(project.id);
    this.clientName = project.clientName;
    this.clientPhone = project.clientPhone;
    this.clientEmail = project.clientEmail;
    this.address = project.address;
    this.installDate = project.installDate ?? '';
    this.notes = project.notes;
    this.installationManual = !!project.installationManual; // vanadel projektidel on see tühi (null)
    this.installationPrice = project.installationPrice;
    this.discountPercent = project.discountPercent;
    this.items = project.items.map(i => ({ variantId: i.variant.id, quantity: i.quantity }));
    this.error.set('');
    this.message.set('');
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  saveProject() {
    const items = this.items.filter(i => i.variantId && i.quantity > 0);
    if (!this.clientName || !this.address || items.length === 0) {
      this.error.set('Täida kliendi nimi, aadress ja vähemalt üks toode.');
      return;
    }
    const body = {
      clientName: this.clientName, clientPhone: this.clientPhone, clientEmail: this.clientEmail,
      address: this.address, installDate: this.installDate || null, notes: this.notes,
      installationManual: this.installationManual, installationPrice: this.installationPrice || 0,
      discountPercent: this.discountPercent || 0, items
    };
    const id = this.editingId();
    const request = id
      ? this.http.put<Project>(this.apiUrl + "/projects/" + id, body)
      : this.http.post<Project>(this.apiUrl + "/partners/" + this.partner().id + "/projects", body);
    request.subscribe({
      next: project => {
        this.resetForm();
        this.message.set(id ? 'Muudatused salvestatud. Hinnapakkumine on uuendatud.' : 'Projekt loodud. Ava hinnapakkumine ja saada see kliendile.');
        this.load(this.partner().id);
        this.offerProject.set(project);
      },
      error: () => this.error.set('Projekti salvestamine ei õnnestunud.')
    });
  }

  confirm(project: Project) {
    this.http.put<Project>(this.apiUrl + "/projects/" + project.id + "/confirm", {}).subscribe(() => this.load(this.partner().id));
  }

  order(project: Project) {
    this.error.set('');
    this.http.post<Project>(this.apiUrl + "/projects/" + project.id + "/order", {}).subscribe({
      next: saved => {
        this.message.set('Tellimus nr ' + saved.orderId + ' on esitatud. Saadame arve e-postiga.');
        this.load(this.partner().id);
        this.ordered.emit();
      },
      error: () => this.error.set('Tellimust ei õnnestunud esitada. Võib-olla pole mõnda toodet nii palju laos.')
    });
  }

  // „Loo arve" avab arve koostamise akna, kus saab ridu, allahindlust ja maksetähtaega muuta
  createInvoice(project: Project) {
    this.error.set('');
    this.invoiceProject.set(project);
  }

  // Arve on koostatud: sulgeme akna, näitame teadet ja avame valmis arve
  onInvoiceCreated(invoice: Invoice) {
    this.invoiceProject.set(null);
    this.load(this.partner().id);
    this.showToast('Arve nr ' + invoice.number + ' on koostatud. Selle leiad ka vahelehelt „Arved".');
    this.invoice.set(invoice);
  }

  showToast(text: string) {
    this.toast.set(text);
    setTimeout(() => this.toast.set(''), 6000);
  }

  openInvoice(project: Project) {
    this.http.get<Invoice>(this.apiUrl + "/invoices/" + project.invoiceId).subscribe(invoice => this.invoice.set(invoice));
  }

  remove(project: Project) {
    if (!confirm('Kas kustutada projekt ' + project.clientName + '?')) return;
    this.http.delete(this.apiUrl + "/projects/" + project.id).subscribe(() => this.load(this.partner().id));
  }

  resetForm() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.error.set('');
    this.clientName = ''; this.clientPhone = ''; this.clientEmail = ''; this.address = '';
    this.installDate = ''; this.notes = ''; this.installationManual = false; this.installationPrice = 0;
    this.discountPercent = 0;
    this.items = [{ variantId: null, quantity: 1 }];
  }
}
