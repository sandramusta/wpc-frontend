import { Category } from "./Category"
import { ProductVariant } from "./ProductVariant"

export type Product = {
    id: number,
    name: string,
    description: string,
    material: string,
    kitContents: string,
    image: string | null,
    active: boolean,
    colors: string[],
    category: Category | null,
    variants: ProductVariant[],
}