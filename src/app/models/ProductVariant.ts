export type ProductVariant = {
    id: number,
    lengthMm: number,
    color: string,
    price: number,
    weightKg: number,
    stock: number,
    expectedDate?: string | null, // eeldatav tarneaeg, nt "2027-03-15"
}