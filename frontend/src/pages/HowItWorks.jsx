import React from "react";

export default function HowItWorks() {

    return (
        <div style={styles.container}>


            <div style={styles.hero}>

                <div style={styles.badge}>
                    ViteVendu
                </div>


                <h1 style={styles.title}>
                    ⚡ Comment fonctionne ViteVendu ?
                </h1>


                <p style={styles.intro}>
                    ViteVendu est une marketplace ivoirienne qui permet
                    aux acheteurs et vendeurs de se connecter facilement
                    pour acheter, vendre et développer leurs activités.
                </p>

            </div>



            <div style={styles.cards}>


                <section style={styles.card}>


                    <div style={styles.icon}>
                        🛒
                    </div>


                    <div>

                        <h2 style={styles.cardTitle}>
                            Pour les acheteurs
                        </h2>


                        <p style={styles.text}>
                            Trouvez rapidement les produits qui vous intéressent,
                            consultez les annonces disponibles et échangez
                            directement avec les vendeurs.
                        </p>


                        <ul style={styles.list}>

                            <li>
                                Rechercher un produit
                            </li>

                            <li>
                                Consulter les informations de l'annonce
                            </li>

                            <li>
                                Contacter le vendeur
                            </li>

                            <li>
                                Organiser la livraison
                            </li>

                        </ul>

                    </div>


                </section>





                <section style={styles.card}>


                    <div style={styles.icon}>
                        🏪
                    </div>


                    <div>

                        <h2 style={styles.cardTitle}>
                            Pour les vendeurs
                        </h2>


                        <p style={styles.text}>
                            ViteVendu permet aux commerçants, artisans et
                            entrepreneurs de créer leur vitrine digitale
                            et de présenter leurs produits facilement.
                        </p>


                        <ul style={styles.list}>

                            <li>
                                Créer un compte vendeur
                            </li>

                            <li>
                                Publier des annonces
                            </li>

                            <li>
                                Recevoir des demandes clients
                            </li>

                            <li>
                                Développer son activité
                            </li>

                        </ul>

                    </div>


                </section>





                <section style={styles.card}>


                    <div style={styles.icon}>
                        🇨🇮
                    </div>


                    <div>

                        <h2 style={styles.cardTitle}>
                            Une solution adaptée à la Côte d'Ivoire
                        </h2>


                        <p style={styles.text}>
                            Notre objectif est de faciliter le commerce local
                            en rapprochant les acheteurs et les vendeurs grâce
                            aux outils numériques.
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
        padding: "32px",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        boxShadow: "0 5px 15px rgba(0,0,0,0.04)"

    },


    icon: {

        width: "60px",
        height: "60px",
        background: "#eff6ff",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        flexShrink: 0

    },


    cardTitle: {

        fontSize: "20px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 12px 0"

    },


    text: {

        fontSize: "15px",
        lineHeight: "1.7",
        color: "#475569"

    },


    list: {

        paddingLeft: "20px",
        color: "#475569",
        lineHeight: "1.8",
        fontSize: "14.5px"

    }

};