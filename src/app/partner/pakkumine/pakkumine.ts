import { Component, computed, input, output } from '@angular/core';
import { Invoice, Partner, Project, dateEt, euro, offerTotals, withoutVat, round2 } from '../partner-types';

type Item = Project['items'][number];

// Üks rida pakkumise või arve tabelis
type Row = {
  name: string;
  lengthMm: number | null;
  color: string;
  quantity: number;
  weight: number | null; // kogukaal
  unitPrice: number;     // ilma KM-ta
  total: number;         // ilma KM-ta
  item?: Item;           // pakkumisel: projekti rida, mille järgi näidatakse saadavust
};

// Hinnapakkumine või arve partneri kliendile. Ülal ja jaluses on partneri enda andmed ja logo, mitte WPC omad.
@Component({
  selector: 'app-pakkumine',
  templateUrl: './pakkumine.html',
  styleUrl: './pakkumine.css',
})
export class Pakkumine {
  project = input.required<Project>();
  partner = input.required<Partner>();
  invoice = input<Invoice | null>(null); // kui on antud, näidatakse arvet, muidu hinnapakkumist
  close = output<void>();

  // Arvel on oma salvestatud read ja summad, pakkumisel arvutatakse need projektist
  rows = computed<Row[]>(() => {
    const inv = this.invoice();
    if (inv) {
      return inv.lines.map(l => ({
        name: l.name, lengthMm: l.lengthMm, color: l.color, quantity: l.quantity,
        weight: l.weightKg ? l.weightKg * l.quantity : null,
        unitPrice: l.unitPrice, total: round2(l.unitPrice * l.quantity),
      }));
    }
    const p = this.project();
    const rows: Row[] = p.items.map(i => ({
      name: 'WPC aialippide komplekt', lengthMm: i.variant.lengthMm, color: i.variant.color, quantity: i.quantity,
      weight: i.variant.weightKg * i.quantity,
      unitPrice: withoutVat(i.variant.price), total: this.lineTotal(i.variant.price, i.quantity), item: i,
    }));
    if (p.installationPrice > 0) {
      rows.push({ name: 'Paigaldustöö', lengthMm: null, color: '', quantity: 1, weight: null,
        unitPrice: p.installationPrice, total: p.installationPrice });
    }
    return rows;
  });

  totals = computed(() => {
    const inv = this.invoice();
    if (inv) {
      return { total: inv.total, discount: inv.discount, subtotal: inv.totalWithoutVat, vat: inv.vat, grandTotal: inv.grandTotal };
    }
    return offerTotals(this.project());
  });

  offerDate = computed(() => new Date(this.project().createdAt));
  validUntil = computed(() => {
    const d = new Date(this.project().createdAt);
    d.setDate(d.getDate() + 7); // pakkumine kehtib 7 päeva
    return d;
  });

  // Laoseisu märkeid näidatakse ainult pakkumisel. Tellitud projekti kaup on juba kliendi jaoks broneeritud.
  showStock = computed(() => !this.invoice() && this.project().status !== 'ORDERED');

  shortItems = computed(() => this.project().items.filter(i => i.variant.stock < i.quantity));

  // Kõige hilisem eeldatav tarneaeg puuduolevatest toodetest. null = mõnel tootel kuupäev puudub.
  latestDate = computed(() => {
    const dates = this.shortItems().map(i => i.variant.expectedDate);
    if (dates.some(d => !d)) return null;
    return dates.sort().at(-1) ?? null;
  });

  euro = euro;
  dateEt = dateEt;

  // Rea summa ilma KM-ta: arvutatakse koguhinnast, nii klapib see „Kokku" reaga sendi pealt
  lineTotal(price: number, quantity: number): number {
    return round2(price * quantity / 1.24);
  }

  // Märge toote all: kas laos, osaliselt laos või tellimisel koos eeldatava tarnekuupäevaga
  availability(i: Item): string {
    if (i.variant.stock >= i.quantity) return 'Laos olemas';
    const when = i.variant.expectedDate ? 'eeldatav tarne ' + dateEt(i.variant.expectedDate) : 'tarneaeg täpsustamisel';
    if (i.variant.stock > 0) {
      return 'Laos ' + i.variant.stock + ' tk, ' + (i.quantity - i.variant.stock) + ' tk tellimisel, ' + when;
    }
    return 'Tellimisel, ' + when;
  }

  print() {
    window.print(); // brauseri prindiaknas saab valida ka „Salvesta PDF-ina"
  }
}
