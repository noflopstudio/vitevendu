import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    // 💾 SAVE LOCALSTORAGE
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // ➕ ADD TO CART
    const addToCart = (product) => {

        setCart((prev) => {

            const existing = prev.find(
                (item) =>
                    item.id === product.id &&
                    item.size === product.size
            );

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id &&
                        item.size === product.size
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...prev,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    // ➖ REMOVE
    const removeFromCart = (id, size) => {

        setCart((prev) =>
            prev.filter(
                (item) =>
                    !(item.id === id && item.size === size)
            )
        );
    };

    // 🔄 UPDATE QUANTITY
    const updateQuantity = (id, size, quantity) => {

        if (quantity <= 0) return;

        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // 🧹 CLEAR
    const clearCart = () => {
        setCart([]);
    };

    // 💰 TOTAL
    const total = cart.reduce(
        (acc, item) =>
            acc + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}