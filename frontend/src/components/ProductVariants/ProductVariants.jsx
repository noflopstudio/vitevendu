import { useState, useMemo } from "react";
import VariantSelector from "./VariantSelector";
import VariantImages from "./VariantImages";
import VariantStock from "./VariantStock";
import VariantCard from "./VariantCard";

export default function ProductVariants({ product }) {
    const [selectedVariant, setSelectedVariant] = useState(null);

    const variants = product?.variants || [];

    const activeVariant = useMemo(() => {
        return selectedVariant || variants[0] || null;
    }, [selectedVariant, variants]);

    if (!product) return null;

    return (
        <div style={{ display: "grid", gap: 15 }}>
            <VariantImages variant={activeVariant} />

            <VariantCard product={product} variant={activeVariant} />

            <VariantStock variant={activeVariant} />

            <VariantSelector
                variants={variants}
                selectedVariant={activeVariant}
                onSelect={setSelectedVariant}
            />
        </div>
    );
}