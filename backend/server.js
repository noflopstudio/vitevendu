const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
    res.json({
        message: "ViteVendu API PRO 🚀",
        status: "OK"
    });
});

// =======================
// GET ADS
// =======================
app.get("/ads", async (req, res) => {
    const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("id", { ascending: false });

    if (error) return res.status(500).json(error);

    // 🔥 sécuriser structure + éviter undefined côté frontend
    const safeAds = (data || []).map(ad => ({
        id: ad.id,
        title: ad.title,
        price: ad.price,
        description: ad.description || "",
        image: ad.image || "",
        user_id: ad.user_id || null, // 🔥 IMPORTANT
        created_at: ad.created_at || null
    }));

    res.json(safeAds);
});

// =======================
// CREATE AD (🔥 FIX IMPORTANT)
// =======================
app.post("/ads", async (req, res) => {
    const { title, price, description, image, user_id } = req.body;

    if (!title || !price) {
        return res.status(400).json({
            message: "title et price sont obligatoires"
        });
    }

    const { data, error } = await supabase
        .from("ads")
        .insert([
            {
                title,
                price,
                description: description || "",
                image: image || "",
                user_id: user_id || null   // 🔥 IMPORTANT FIX
            }
        ])
        .select();

    if (error) return res.status(500).json(error);

    res.json({
        message: "Annonce créée ✔",
        data: data[0]
    });
});

// =======================
// DELETE AD
// =======================
app.delete("/ads/:id", async (req, res) => {
    const id = req.params.id;

    const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", id);

    if (error) return res.status(500).json(error);

    res.json({
        message: "Annonce supprimée ✔",
        id
    });
});

// =======================
// REGISTER USER
// =======================
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase
        .from("users")
        .insert([{ email, password }])
        .select();

    if (error) return res.status(500).json(error);

    res.json({
        message: "Compte créé ✔",
        user: data[0]
    });
});

// =======================
// LOGIN USER
// =======================
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password);

    if (error) return res.status(500).json(error);

    if (data.length === 0) {
        return res.status(401).json({
            message: "Login incorrect ❌"
        });
    }

    res.json({
        message: "Login OK ✔",
        user: data[0]
    });
});

// =======================
// SERVER START
// =======================
const PORT = 5000;

app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});


// =======================
// WAVE WEBHOOK (AUTO ABONNEMENT)
// =======================
app.post("/wave-webhook", async (req, res) => {
    try {
        const event = req.body;

        console.log("🔥 WAVE EVENT:", event);

        // ⚠️ selon Wave, adapte si besoin
        if (event.type === "payment_success") {

            const userId = event.metadata?.user_id;

            if (!userId) {
                return res.status(400).json({
                    error: "user_id manquant"
                });
            }

            // =======================
            // ACTIVER ABONNEMENT AUTO
            // =======================
            const { error } = await supabase
                .from("subscriptions")
                .upsert([
                    {
                        user_id: userId,
                        status: "active",
                        start_date: new Date(),
                        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                ]);

            if (error) {
                console.log("❌ Supabase error:", error);
                return res.status(500).json(error);
            }

            console.log("✅ ABONNEMENT ACTIVÉ POUR:", userId);
        }

        res.status(200).send("OK");

    } catch (err) {
        console.error("WEBHOOK ERROR:", err);
        res.status(500).send("ERROR");
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ ViteVendu API running on http://localhost:${PORT}`);
});