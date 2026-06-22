export default function VariantCard({ product, variant }) {
    if (!product) return null;

    const price = variant?.price ?? product.price ?? 0;

    return (
        <div
            style={{
                padding: 12,
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                background: "#fff",
            }}
        >
            <h2 style={{ marginBottom: 5 }}>{product.title}</h2>

            <p style={{ margin: 0 }}>
                Prix :{" "}
                <strong style={{ color: "#064e3b" }}>{price} FCFA</strong>
            </p>

            {variant?.name && (
                <p style={{ marginTop: 5, color: "#64748b" }}>
                    Variante : {variant.name}
                </p>
            )}
        </div>
    );
}