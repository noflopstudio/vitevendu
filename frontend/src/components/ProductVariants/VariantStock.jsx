export default function VariantStock({ variant }) {
    if (!variant) return null;

    const stock = variant.stock ?? 0;

    let status = "En stock";
    let color = "#16a34a";

    if (stock <= 0) {
        status = "Rupture de stock";
        color = "#dc2626";
    } else if (stock <= 5) {
        status = "Stock faible";
        color = "#f59e0b";
    }

    return (
        <div
            style={{
                padding: 10,
                borderRadius: 8,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
            }}
        >
            <p style={{ margin: 0, color }}>
                {status} ({stock})
            </p>
        </div>
    );
}