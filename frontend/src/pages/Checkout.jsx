```jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Checkout({ cart = [] }) {

    const [paymentMethod, setPaymentMethod] = useState("wave");
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // TOTAL

    const total = cart.reduce((sum, item) => {
        return sum + Number(item.price) * (item.quantity || 1);
    }, 0);

    // FILE

    const handleFileChange = (e) => {

        if (e.target.files[0]) {
            setProof(e.target.files[0]);
        }
    };

    // CREATE ORDER

    const handleOrder = async () => {

        setLoading(true);
        setMessage("");

        try {

            // USER

            const { data } =
                await supabase.auth.getUser();

            const user = data.user;

            if (!user) {

                setMessage("Connectez-vous");

                setLoading(false);

                return;
            }

            // IMAGE

            let proofUrl = null;

            if (proof) {

                const fileName =
                    Date.now() + "-" + proof.name;

                const { error: uploadError } =
                    await supabase.storage
                        .from("payment-proofs")
                        .upload(fileName, proof);

                if (uploadError) {

                    setMessage("Erreur upload image");

                    setLoading(false);

                    return;
                }

                const { data: imageData } =
                    supabase.storage
                        .from("payment-proofs")
                        .getPublicUrl(fileName);

                proofUrl = imageData.publicUrl;
            }

            // CREATE ORDER

            const res = await fetch(
                "https://lahinfodbprtocyavgod.supabase.co/functions/v1/create-order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({

                        cart,

                        user_id: user.id,

                        payment_method: paymentMethod,

                        proof_url: proofUrl,

                        total

                    }),
                }
            );

            const result = await res.json();

            if (!result.success) {

                setMessage("Erreur commande");

                setLoading(false);

                return;
            }

            setMessage("Commande créée avec succès");

        } catch (err) {

            console.log(err);

            setMessage("Erreur serveur");
        }

        setLoading(false);
    };

    return (

        <div style={styles.page}>

            <div style={styles.container}>

                <h1>
                    Finaliser commande
                </h1>

                {/* TOTAL */}

                <div style={styles.totalBox}>

                    <h2>
                        {total.toLocaleString()} FCFA
                    </h2>

                </div>

                {/* PAYMENT */}

                <div style={styles.paymentButtons}>

                    <button
                        onClick={() => setPaymentMethod("wave")}
                    >
                        💙 Wave
                    </button>

                    <button
                        onClick={() => setPaymentMethod("orange")}
                    >
                        🧡 Orange
                    </button>

                    <button
                        onClick={() => setPaymentMethod("cod")}
                    >
                        🚚 Livraison
                    </button>

                </div>

                {/* FILE */}

                {paymentMethod !== "cod" && (

                    <div>

                        <p>
                            Envoyez le paiement ici :
                        </p>

                        <h3>
                            +225 07 48 92 23 97
                        </h3>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                    </div>
                )}

                {/* BUTTON */}

                <button
                    onClick={handleOrder}
                    disabled={loading}
                    style={styles.orderBtn}
                >

                    {loading
                        ? "Chargement..."
                        : "Confirmer"}

                </button>

                {/* MESSAGE */}

                {message && (

                    <p style={styles.message}>
                        {message}
                    </p>

                )}

            </div>

        </div>
    );
}

// STYLES

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: 20,
    },

    container: {
        maxWidth: 500,
        margin: "0 auto",
        background: "#fff",
        padding: 20,
        borderRadius: 15,
    },

    totalBox: {
        background: "#0f172a",
        color: "#fff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },

    paymentButtons: {
        display: "flex",
        gap: 10,
        marginBottom: 20,
    },

    orderBtn: {
        width: "100%",
        padding: 15,
        border: "none",
        background: "#0f172a",
        color: "#fff",
        borderRadius: 10,
        marginTop: 20,
        cursor: "pointer",
    },

    message: {
        marginTop: 20,
    },
};
```
