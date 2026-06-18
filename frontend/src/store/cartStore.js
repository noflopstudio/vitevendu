import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],

            // ➕ AJOUT AU PANIER
            addToCart: (product) =>
                set((state) => {
                    const clean = {
                        ...product,
                        price: Number(product.price),
                        size: product.size ?? null,
                        color: product.color ?? null,
                        clothSize: product.clothSize ?? null,
                    };

                    const index = state.cart.findIndex(
                        (p) =>
                            p.id === clean.id &&
                            (p.size ?? null) === (clean.size ?? null) &&
                            (p.color ?? null) === (clean.color ?? null) &&
                            (p.clothSize ?? null) === (clean.clothSize ?? null)
                    );

                    if (index !== -1) {
                        const updated = [...state.cart];
                        updated[index].quantity += 1;
                        return { cart: updated };
                    }

                    return {
                        cart: [...state.cart, { ...clean, quantity: 1 }],
                    };
                }),

            // ➕ AUGMENTER LA QUANTITÉ
            increaseQuantity: (item) =>
                set((state) => {
                    const targetSize = item.size ?? null;
                    const targetColor = item.color ?? null;
                    const targetClothSize = item.clothSize ?? null;

                    return {
                        cart: state.cart.map((p) =>
                            p.id === item.id &&
                                (p.size ?? null) === targetSize &&
                                (p.color ?? null) === targetColor &&
                                (p.clothSize ?? null) === targetClothSize
                                ? { ...p, quantity: (p.quantity || 1) + 1 }
                                : p
                        ),
                    };
                }),

            // ➖ DIMINUER LA QUANTITÉ
            decreaseQuantity: (item) =>
                set((state) => {
                    const targetSize = item.size ?? null;
                    const targetColor = item.color ?? null;
                    const targetClothSize = item.clothSize ?? null;

                    return {
                        cart: state.cart
                            .map((p) =>
                                p.id === item.id &&
                                    (p.size ?? null) === targetSize &&
                                    (p.color ?? null) === targetColor &&
                                    (p.clothSize ?? null) === targetClothSize
                                    ? { ...p, quantity: (p.quantity || 1) - 1 }
                                    : p
                            )
                            .filter((p) => p.quantity > 0),
                    };
                }),

            // 🗑️ SUPPRIMER DIRECTEMENT UN ARTICLE
            removeFromCart: (item) =>
                set((state) => {
                    const targetSize = item.size ?? null;
                    const targetColor = item.color ?? null;
                    const targetClothSize = item.clothSize ?? null;

                    return {
                        cart: state.cart.filter(
                            (p) =>
                                !(
                                    p.id === item.id &&
                                    (p.size ?? null) === targetSize &&
                                    (p.color ?? null) === targetColor &&
                                    (p.clothSize ?? null) === targetClothSize
                                )
                        ),
                    };
                }),

            // 🧹 VIDER LE PANIER
            clearCart: () => set({ cart: [] }),

            // 💰 CALCUL DU PRIX TOTAL
            getTotalPrice: () =>
                get().cart.reduce(
                    (total, item) => total + Number(item.price) * (item.quantity || 1),
                    0
                ),
        }),
        {
            name: "vitevendu-cart"
        }
    )
);