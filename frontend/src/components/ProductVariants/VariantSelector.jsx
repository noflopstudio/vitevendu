export default function VariantSelector({
    variants = [],
    selectedVariant,
    onSelect,
}) {
    if (!variants.length) return null;

    return (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {variants.map((v) => {
                const isActive = selectedVariant?.id === v.id;

                return (
                    <button
                        key={v.id}
                        onClick={() => onSelect(v)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                            border: isActive
                                ? "2px solid #064e3b"
                                : "1px solid #cbd5e1",
                            background: isActive ? "#064e3b" : "#fff",
                            color: isActive ? "#fff" : "#000",
                        }}
                    >
                        {v.name}
                    </button>
                );
            })}
        </div>
    );
}