import { useState, useEffect } from "react";

export default function VariantImages({ variant }) {
    const images = variant?.images || [];
    const [active, setActive] = useState(0);

    useEffect(() => {
        setActive(0);
    }, [variant]);

    if (!images.length) {
        return (
            <div style={{ padding: 20, background: "#f1f5f9" }}>
                Aucune image
            </div>
        );
    }

    return (
        <div>
            <img
                src={images[active]}
                alt="variant"
                style={{
                    width: "100%",
                    maxHeight: 420,
                    objectFit: "cover",
                    borderRadius: 12,
                }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        onClick={() => setActive(i)}
                        style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 6,
                            cursor: "pointer",
                            border: active === i ? "2px solid #064e3b" : "1px solid #ddd",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}