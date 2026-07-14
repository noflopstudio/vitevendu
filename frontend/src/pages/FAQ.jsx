import React from "react";

export default function FAQ() {

    return (
        <div style={styles.container}>

            <div style={styles.hero}>

                <div style={styles.badge}>
                    FAQ ViteVendu
                </div>

                <h1 style={styles.title}>
                    ❓ Questions fréquentes
                </h1>

                <p style={styles.intro}>
                    Retrouvez les réponses aux questions les plus fréquentes
                    concernant l'achat, la vente et l'utilisation de ViteVendu.
                </p>

            </div>


            <div style={styles.cards}>


                <section style={styles.card}>

                    <div style={styles.icon}>
                        🛒
                    </div>

                    <div>

                        <h2 style={styles.cardTitle}>
                            Qu'est-ce que ViteVendu ?
                        </h2>

                        <p style={styles.text}>
                            ViteVendu est une marketplace digitale ivoirienne
                            qui permet aux particuliers, commerçants et
                            entrepreneurs de vendre et d'acheter facilement
                            des produits en ligne.
                        </p>

                    </div>

                </section>



                <section style={styles.card}>

                    <div style={styles.icon}>
                        🔎
                    </div>

                    <div>

                        <h2 style={styles.cardTitle}>
                            Comment acheter un produit ?
                        </h2>

                        <p style={styles.text}>
                            Recherchez un produit, consultez les informations
                            de l'annonce puis contactez directement le vendeur
                            pour discuter des détails et organiser la livraison.
                        </p>

                    </div>

                </section>




                <section style={styles.card}>

                    <div style={styles.icon}>
                        🏪
                    </div>

                    <div>

                        <h2 style={styles.cardTitle}>
                            Comment vendre sur ViteVendu ?
                        </h2>

                        <p style={styles.text}>
                            Créez votre compte vendeur, ajoutez vos produits
                            avec des photos et descriptions détaillées puis
                            commencez à recevoir des demandes d'acheteurs.
                        </p>

                    </div>

                </section>




                <section style={styles.card}>

                    <div style={styles.icon}>
                        💰
                    </div>

                    <div>

                        <h2 style={styles.cardTitle}>
                            ViteVendu prend-il une commission ?
                        </h2>

                        <p style={styles.text}>
                            ViteVendu propose un modèle transparent afin
                            d'offrir une solution accessible aux vendeurs
                            et entrepreneurs locaux.
                        </p>

                    </div>

                </section>




                <section style={styles.card}>

                    <div style={styles.icon}>
                        📞
                    </div>

                    <div>

                        <h2 style={styles.cardTitle}>
                            Comment contacter ViteVendu ?
                        </h2>

                        <p style={styles.text}>
                            Vous pouvez contacter notre équipe via la page
                            Contact pour toute question, assistance ou
                            demande d'information.
                        </p>

                    </div>

                </section>


            </div>


        </div>
    );
}



const styles = {


    container: {

        background: "#f8fafc",
        minHeight: "100vh",
        padding: "60px 24px",
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b"

    },


    hero: {

        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center",
        marginBottom: "50px"

    },


    badge: {

        display: "inline-block",
        background: "#e0e7ff",
        color: "#4338ca",
        fontSize: "12px",
        fontWeight: "700",
        padding: "6px 14px",
        borderRadius: "20px",
        textTransform: "uppercase",
        marginBottom: "15px"

    },


    title: {

        fontSize: "36px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "15px"

    },


    intro: {

        fontSize: "17px",
        color: "#64748b",
        lineHeight: "1.6",
        maxWidth: "680px",
        margin: "0 auto"

    },


    cards: {

        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px"

    },


    card: {

        background: "#ffffff",
        padding: "28px",
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: "22px",
        alignItems: "flex-start",
        boxShadow: "0 5px 15px rgba(0,0,0,0.04)"

    },


    icon: {

        width: "56px",
        height: "56px",
        background: "#eff6ff",
        borderRadius: "14px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "25px",
        flexShrink: 0

    },


    cardTitle: {

        fontSize: "20px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 10px 0"

    },


    text: {

        fontSize: "15px",
        color: "#475569",
        lineHeight: "1.7",
        margin: 0

    }


};