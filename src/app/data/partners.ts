// Paigaldajad ja edasimüüjad. Siia lisad uue partneri ühe reana.
// lat ja lng on asukoha koordinaadid (Google Maps: paremklõps kohal → esimene rida).
// logo: pane pilt kausta public/partners ja kirjuta siia nt 'partners/firma.png'.

export type Partner = {
  nimi: string;
  tyyp: 'paigaldaja' | 'edasimuuja';
  linn: string;
  lat: number;
  lng: number;
  telefon?: string;
  email?: string;
  veeb?: string;
  logo?: string;
};

export const PARTNERS: Partner[] = [
  { nimi: 'WPC.EE paigaldusteenus', tyyp: 'paigaldaja', linn: 'Haaslava, Tartumaa', lat: 58.32, lng: 26.9, telefon: '+372 5698 8771', email: 'info@wpc.ee' },
  // NÄIDISED: asenda päris edasimüüjatega (nimi, linn, kontakt, koduleht, logo)
  { nimi: 'Aiameister', tyyp: 'edasimuuja', linn: 'Tallinn', lat: 59.437, lng: 24.754, email: 'info@example.com', veeb: 'https://example.com', logo: 'partners/sample-1.svg' },
  { nimi: 'Piirdeaed', tyyp: 'edasimuuja', linn: 'Tartu', lat: 58.378, lng: 26.729, email: 'info@example.com', veeb: 'https://example.com', logo: 'partners/sample-2.svg' },
  { nimi: 'Hoovikeskus', tyyp: 'edasimuuja', linn: 'Pärnu', lat: 58.385, lng: 24.497, email: 'info@example.com', veeb: 'https://example.com', logo: 'partners/sample-3.svg' },
  { nimi: 'AedPro', tyyp: 'edasimuuja', linn: 'Rakvere', lat: 59.346, lng: 26.355, email: 'info@example.com', veeb: 'https://example.com', logo: 'partners/sample-4.svg' },
  { nimi: 'Kodu & Aed', tyyp: 'edasimuuja', linn: 'Viljandi', lat: 58.364, lng: 25.59, email: 'info@example.com', veeb: 'https://example.com', logo: 'partners/sample-5.svg' },
  // Näide, kuidas lisada (eemalda // rea algusest):
  // { nimi: 'Firma OÜ', tyyp: 'paigaldaja', linn: 'Tallinn', lat: 59.437, lng: 24.754, telefon: '+372 ...', email: 'info@firma.ee', logo: 'partners/firma.png' },
];

// Linnad, mille seast klient saab oma asukoha valida
export const CITIES = [
  { nimi: 'Tallinn', lat: 59.437, lng: 24.754 },
  { nimi: 'Tartu', lat: 58.378, lng: 26.729 },
  { nimi: 'Pärnu', lat: 58.385, lng: 24.497 },
  { nimi: 'Narva', lat: 59.377, lng: 28.19 },
  { nimi: 'Viljandi', lat: 58.364, lng: 25.59 },
  { nimi: 'Rakvere', lat: 59.346, lng: 26.355 },
  { nimi: 'Kuressaare', lat: 58.253, lng: 22.485 },
  { nimi: 'Haapsalu', lat: 58.943, lng: 23.541 },
  { nimi: 'Jõhvi', lat: 59.359, lng: 27.421 },
  { nimi: 'Võru', lat: 57.834, lng: 27.019 },
  { nimi: 'Valga', lat: 57.777, lng: 26.047 },
  { nimi: 'Põlva', lat: 58.06, lng: 27.069 },
  { nimi: 'Paide', lat: 58.886, lng: 25.557 },
  { nimi: 'Rapla', lat: 58.999, lng: 24.793 },
  { nimi: 'Jõgeva', lat: 58.746, lng: 26.394 },
  { nimi: 'Kärdla', lat: 58.998, lng: 22.749 },
];
