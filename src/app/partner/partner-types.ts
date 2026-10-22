import { ProductVariant } from '../models/ProductVariant';

export type Partner = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  companyRegCode: string;
  vatNumber: string;
  companyAddress: string;
  website: string;
  bankName: string;
  bankAccount: string;
  logo: string | null;
  installationHourlyRate: number | null;  // paigalduse tunnihind km-ta
  installationHoursPerKit: number | null; // mitu tundi kulub ühe komplekti paigaldamiseks
  partnerLevel: 'PARTNER' | 'PRO';
  discountPercent: number;
};

export type Project = {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  installDate: string;      // "2026-11-05"
  notes: string;
  installationPrice: number; // ilma KM-ta
  installationManual: boolean; // true = partner kirjutas hinna ise
  discountPercent: number;
  status: 'OFFER' | 'CONFIRMED' | 'ORDERED';
  createdAt: string;
  orderId: number | null;
  invoiceId: number | null;
  items: { id: number; quantity: number; variant: ProductVariant }[];
};

export type InvoiceLine = {
  name: string;            // nt "WPC aialippide komplekt" või "Paigaldustöö"
  lengthMm: number | null;
  color: string;
  quantity: number;
  weightKg: number | null; // ühe tüki kaal
  unitPrice: number;       // ilma KM-ta
};

export type Invoice = {
  id: number;
  number: string;      // "2026-001"
  invoiceDate: string;
  dueDate: string;
  project: Project;
  lines: InvoiceLine[];
  discountPercent: number;
  total: number;           // ridade summa ilma KM-ta
  discount: number;
  totalWithoutVat: number; // pärast allahindlust
  vat: number;
  grandTotal: number;
  paid: boolean;
};

export const VAT = 0.24; // käibemaks 24%

// Hinnad poes on koos KM-ga, pakkumisel näidatakse ühikuhinda ilma KM-ta
export function withoutVat(price: number): number {
  return Math.round(price / (1 + VAT) * 100) / 100;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function euro(amount: number): string {
  return amount.toFixed(2).replace('.', ',');
}

export function heightLabel(mm: number): string {
  return (mm / 1000).toFixed(2).replace('.', ',') + ' m';
}

export function dateEt(value: string | Date): string {
  return new Date(value).toLocaleDateString('et-EE');
}

// Pakkumise summad nagu WPC hinnapakkumise põhjal
export function offerTotals(project: Project) {
  // Toodete summa ilma KM-ta arvutatakse koguhinnast, et ümardamine ei tekitaks sendierinevust
  const products = round2(project.items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0) / (1 + VAT));
  const total = round2(products + (project.installationPrice || 0));
  const discount = round2(total * (project.discountPercent || 0) / 100);
  const subtotal = round2(total - discount);
  const vat = round2(subtotal * VAT);
  return { products, total, discount, subtotal, vat, grandTotal: round2(subtotal + vat) };
}

// Paigalduse hind tunnihinnast: komplektide arv × tunde komplekti kohta × tunnihind (sama arvutus on backendis)
export function installationFromRate(partner: Partner, kits: number): number {
  const rate = partner.installationHourlyRate ?? 0;
  const hoursPerKit = partner.installationHoursPerKit ?? 1;
  return round2(kits * hoursPerKit * rate);
}
