import { Injectable, computed, signal } from '@angular/core';

export type CartItem = {
    variantId: number;
    name: string;
    heightMm: number;
    color: string;
    price: number;
    quantity: number;
};

@Injectable({ providedIn: 'root' })
export class CartService {
    // signal = väärtus, mille muutumisest Angular ise teada saab ja lehte uuendab
    items = signal<CartItem[]>(JSON.parse(localStorage.getItem('wpc-cart') || '[]'));
    count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
    total = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));

    // Kui sama variant on juba korvis, suurendame kogust, muidu lisame uue rea
    add(newItem: CartItem) {
        const existing = this.items().find(item => item.variantId === newItem.variantId);
        const updated = existing
            ? this.items().map(item => item.variantId === newItem.variantId ? { ...item, quantity: item.quantity + newItem.quantity } : item)
            : [...this.items(), newItem];
        this.save(updated);
    }

    remove(variantId: number) {
        this.save(this.items().filter(item => item.variantId !== variantId));
    }

    clear() {
        this.save([]);
    }

    private save(items: CartItem[]) {
        this.items.set(items);
        localStorage.setItem('wpc-cart', JSON.stringify(items));
    }
}