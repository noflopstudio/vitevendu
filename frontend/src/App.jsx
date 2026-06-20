import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import About from "./pages/About.jsx";
import Blog from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";
import Conditions from "./pages/Conditions";
import Partner from "./pages/Partner.jsx";
import MessagesList from "./pages/MessagesList";
import Cart from "./pages/Cart.jsx";
import Analytics from "./admin/analytics/Analytics";
import Profile from "./pages/Profile";

import SellerDashboard from "./pages/SellerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ProductPage from "./pages/ProductPage";
import TrackingMap from "./components/TrackingMap.jsx";
import TrackingPage from "./pages/TrackingPage";
import LivreurPage from "./pages/LivreurPage";

import Users from "./pages/Users";
import Orders from "./pages/Orders.jsx";
import Wallet from "./pages/Wallet.jsx";
import Reviews from "./pages/Reviews.jsx";
import Stock from "./pages/Stock.jsx";
import AdminDashboard from "./admin/AdminDashboard";
import Roles from "./admin/roles/Roles";
import BlockedUsers from "./admin/users/BlockedUsers";

import OrdersAll from "./admin/orders/OrdersAll";
import OrdersPending from "./admin/orders/OrdersPending";
import OrdersPaid from "./admin/orders/OrdersPaid";
import OrdersShipping from "./admin/orders/OrdersShipping";

import Sales from "./admin/sales/Sales";
import Revenue from "./admin/revenue/Revenue";
import Stats from "./admin/stats/Stats";

import Products from "./admin/products/Products";
import Categories from "./admin/categories/Categories";

import Security from "./admin/security/Security";

import Marketplace from "./pages/Marketplace";
import AdminModeration from "./pages/admin/AdminModeration";
import AdminReviews from "./admin/AdminReviews";




function Dashboard({ user, profile, ads, fetchAds }) {
  const navigate = useNavigate();
  const subscriptionStatus = profile?.subscription_status;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingAdId, setEditingAdId] = useState(null);

  /* ===== PROTECTION ABONNEMENT (MODIFIÉE POUR LE DEV) ===== */
  const isPaid = true;
  const isExpired = false;

  if (!user) {
    return (
      <div style={styles.authWrapper}>
        <div style={styles.authCard}>

          <h2 style={{ textAlign: "center", marginBottom: 10 }}>
            🚫 Accès suspendu
          </h2>

          <p style={{ textAlign: "center", marginBottom: 10 }}>
            Votre compte a été suspendu par l’équipe ViteVendu.
          </p>

          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 20 }}>
            Cette action peut être due au non-respect des règles de la plateforme.
          </p>

          <p style={{ textAlign: "center", fontWeight: "bold", marginBottom: 20 }}>
            📩 Contact : support@vitevendu.com
          </p>

          <button
            onClick={() => window.location.href = "/contact"}
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Contacter le support
          </button>

        </div>
      </div>
    );
  }

  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", userData.user.id)
        .single();

      if (profile?.status === "blocked") {
        setBlocked(true);

        // optionnel : logout automatique
        await supabase.auth.signOut();
      }
    };

    checkUserStatus();
  }, []);

  if (blocked) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>🚫 Accès bloqué</h1>
        <p>Votre compte a été suspendu par l’administrateur</p>
      </div>
    );
  }

  if (!isPaid || isExpired) {
    return (
      <div style={styles.authWrapper}>
        <div style={{ ...styles.authCard, maxWidth: "480px", textAlign: "center" }}>
          <span style={{ fontSize: "54px", display: "block", marginBottom: "16px" }}>🔒</span>
          <h2 style={{ ...styles.authTitle, marginBottom: "10px" }}>Accès au Dashboard Suspendu</h2>
          <p style={{ ...styles.authSubtitle, lineHeight: "1.6", marginBottom: "24px" }}>
            Votre période d'abonnement au Plan Pro a expiré ou n'est pas encore active. Veuillez régulariser votre situation pour débloquer vos outils de gestion.
          </p>

          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "left"
          }}>
            <p style={{ margin: "0 0 10px 0", fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" }}>
              Moyens de paiement acceptés :
            </p>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>🌊 Wave</span>
              <span style={{ background: "#ffedd5", color: "#c2410c", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>🍊 Orange</span>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#334155", fontWeight: "500" }}>
              Tarif : <b style={{ color: "#16a34a" }}>5 000 FCFA / mois</b>
            </p>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#334155", fontWeight: "500" }}>
              Marchand : <b style={{ color: "#0f172a" }}>+225 0748922397</b>
            </p>
          </div>

          <button onClick={() => navigate("/")} style={{ ...styles.proBtnPrimary, width: "100%" }}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  /* ===== LOGOUT ===== */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  /* ===== ACTION ÉDITION ===== */
  const startEdit = (ad) => {
    setEditingAdId(ad.id);
    setTitle(ad.title);
    setPrice(ad.price.toString());
    setOldPrice(ad.old_price ? ad.old_price.toString() : "");
    setDescription(ad.description || "");
    setImage(null); // On reset l'input image (on garde l'ancienne en BDD sauf si nouvelle sélectionnée)
  };

  const cancelEdit = () => {
    setEditingAdId(null);
    setTitle("");
    setPrice("");
    setOldPrice("");
    setDescription("");
    setImage(null);
  };

  /* ===== ACTION SUPPRESSION ===== */
  const handleDelete = async (adId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
      await supabase.from("ads").delete().eq("id", adId);
      fetchAds();
    }
  };

  /* ===== SUBMIT AD (CORRIGÉ SANS DOUBLONS) ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price) {
      alert("Titre et prix obligatoires");
      return;
    }

    let imageUrl = null;

    // upload image si nouvelle image
    if (image) {
      const cleanName = image.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")   // enlève accents
        .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // remplace espaces et caractères spéciaux

      const fileName = `${Date.now()}-${cleanName}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, image);

      if (error) {
        console.log("UPLOAD ERROR:", error);
        return alert(error.message);
      }

      imageUrl = supabase.storage
        .from("images")
        .getPublicUrl(data.path).data.publicUrl;
    }

    // NORMALISATION DES PRIX
    const priceValue = Number(price);
    const oldPriceValue = oldPrice ? Number(oldPrice) : null;

    // UPDATE MODE
    if (editingAdId) {
      const { error } = await supabase
        .from("ads")
        .update({
          title,
          price: priceValue,
          old_price: oldPriceValue,
          description,
          image: imageUrl || undefined, // garde ancienne image si pas nouvelle
        })
        .eq("id", editingAdId);

      if (error) {
        console.log(error);
        return alert("Erreur modification");
      }
    }

    // INSERT MODE
    else {
      const { error } = await supabase.from("ads").insert([
        {
          title,
          price: priceValue,
          old_price: oldPriceValue,
          description,
          image: imageUrl,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.log(error);
        return alert("Erreur création");
      }
    }

    // RESET PROPRE
    setEditingAdId(null);
    setTitle("");
    setPrice("");
    setOldPrice("");
    setDescription("");
    setImage(null);

    fetchAds();
  };

  const myAds = ads.filter((a) => a.user_id === user.id);

  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState(profile?.username || "");

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const saveProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ username: username })
      .eq("id", user.id);

    if (error) {
      alert("Erreur sauvegarde");
    } else {
      alert("✅ Profil mis à jour");
    }
  };

  return (
    <div style={styles.dashboardLayout}>

      {/* BOUTON RETOUR RAPIDE À L'ACCUEIL DEPUIS LE DASHBOARD */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 100,
          background: "#ffffff",
          padding: "10px 16px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "700",
          color: "#0f172a",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0"
        }}
      >
        🏠 Retour au site
      </Link>

      {/* BOUTON MESSAGES */}
      <Link
        to="/messages"
        style={{
          position: "fixed",
          top: "70px",
          right: "20px",
          zIndex: 100,
          background: "#4f46e5",
          padding: "10px 16px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "700",
          color: "#ffffff",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(79,70,229,0.25)"
        }}
      >
        💬 Messages
      </Link>

      {/* 1. SIDEBAR DE GESTION */}
      <aside style={styles.sidebar}>
        {/* CARTE UTILISATEUR OPTIMISÉE */}
        <div style={styles.userCard}>
          {/* ZONE PHOTO DE PROFIL STYLE PRO */}
          <div style={styles.avatarContainer}>
            <label style={styles.avatarLabel}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfileImage}
              />
              <img
                src={profileImage || profile?.avatar || "/default-avatar.png"}
                alt="Profil"
                style={styles.avatarImage}
              />
              <div style={styles.avatarOverlay}>
                <span>📷</span>
              </div>
            </label>
            <div style={styles.onlineStatusBadge}></div>
          </div>

          {/* INFORMATIONS ET FORMULAIRE */}
          <div style={styles.profileContent}>
            <span style={styles.profileRoleBadge}>Marchand</span>

            <div style={styles.inputGroup}>
              <label style={styles.fieldLabel}>Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: SuperBoutique"
                style={styles.usernameInput}
              />
            </div>

            {/* ACTIONS */}
            <div style={styles.actionGroup}>
              <button onClick={saveProfile} style={styles.saveProfileBtn}>
                Enregistrer les modifications
              </button>
              <button onClick={handleLogout} style={styles.logoutProfileBtn}>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        {/* COMPOSANT ABONNEMENT INTEGRÉ */}
        <div style={{
          background: "#ffffff",
          padding: "16px",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
        }}>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
          }}>

            <span style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#4b5563",
              textTransform: "uppercase"
            }}>
              Abonnement
            </span>

            <span style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "4px 8px",
              borderRadius: "100px",
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase"
            }}>
              ● Gratuit
            </span>

          </div>

          <p style={{
            margin: "0 0 6px 0",
            fontSize: "13px",
            color: "#111827"
          }}>
            Plan : <b>Accès Gratuit</b>
          </p>

          <p style={{
            margin: "0 0 6px 0",
            fontSize: "11px",
            color: "#6b7280"
          }}>
            💳 La plateforme est actuellement totalement gratuite
          </p>

          <p style={{
            margin: 0,
            fontSize: "11px",
            color: "#6b7280"
          }}>
            🔄 Les abonnements premium seront disponibles très bientôt
          </p>

          <p style={{
            margin: "6px 0 0 0",
            fontSize: "11px",
            color: "#ef4444",
            fontWeight: "600"
          }}>
            ⚠️ Certaines fonctionnalités avancées pourront être payantes à l’avenir
          </p>

        </div>
        {/* FORMULAIRE D'ÉDITION / PUBLICATION */}
        <div style={styles.sidebarModule}>
          <h4 style={styles.moduleTitle}>
            {editingAdId ? "Modifier l'Annonce" : "Nouvelle Publication"}
          </h4>

          <form onSubmit={handleSubmit} style={styles.verticalForm}>
            <input
              style={styles.sidebarInput}
              placeholder="Titre de l'annonce *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              style={styles.sidebarInput}
              placeholder="Ancien prix (FCFA)"
              type="number"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
            />

            <input
              style={styles.sidebarInput}
              placeholder="Prix actuel (FCFA) *"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <textarea
              style={styles.sidebarTextarea}
              placeholder="Description du produit ou service..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />

            <label style={styles.uploadZone}>
              📷 {image ? "Image sélectionnée" : "Ajouter une image"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            <button type="submit" style={styles.proBtnPrimary}>
              {editingAdId ? "Enregistrer les modifications" : "Publier l'annonce"}
            </button>

            {editingAdId && (
              <button type="button" onClick={cancelEdit} style={styles.proBtnSecondary}>
                Annuler
              </button>
            )}
          </form>
        </div>
      </aside>

      {/* 2. ESPACE CENTRAL DES ANNONCES */}
      <main style={styles.mainContent}>
        <div style={styles.viewPort}>
          <div style={styles.viewHeader}>
            <h1 style={styles.mainTitle}>Mon Catalogue</h1>
            <p style={styles.mainSubtitle}>Gérez, modifiez ou supprimez vos annonces en ligne en temps réel.</p>
          </div>

          {myAds.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
              <span style={{ fontSize: "40px" }}>📦</span>
              <p style={{ marginTop: "10px", fontSize: "14px" }}>Vous n'avez pas encore publié d'annonces.</p>
            </div>
          ) : (
            <div style={styles.cleanGrid}>
              {myAds.map((ad) => (
                <div key={ad.id} style={styles.cleanCard}>
                  <div style={styles.cardImageContainer}>
                    {ad.image ? (
                      <img src={ad.image} alt={ad.title} style={styles.cardImg} />
                    ) : (
                      <div style={styles.emptyImgFallback}>Aucun visuel disponible</div>
                    )}
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.cardHeaderRow}>
                      <h3 style={styles.cardTitle}>{ad.title}</h3>
                      <span style={styles.cardPrice}>{ad.price.toLocaleString()} FCFA</span>
                    </div>
                    <p style={styles.cardDescription}>
                      {ad.description || "Aucune description fournie pour cet article."}
                    </p>

                    <div style={styles.cardFooter}>
                      <div style={styles.cardActionGroup}>
                        <button onClick={() => startEdit(ad)} style={styles.btnIconEdit}>
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(ad.id)} style={styles.btnIconDelete}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);



  // ================= ADS =================
  const fetchAds = async () => {
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("ADS ERROR:", error);
      return;
    }

    setAds(data || []);
  };


  // ================= PROFILE =================
  const fetchUserProfile = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("PROFILE ERROR:", error);
      setProfile(null);
      return;
    }

    setProfile(data || null);

    // 🔥 important: sync role ici
    setSubscriptionStatus(data?.subscription_status || null);
  };

  const handleLoginSubmit = async (e, navigateTo, isSignUpMode) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const { data, error } = isSignUpMode
      ? await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { username: email.split("@")[0] }
        }
      })
      : await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    if (data?.user) {
      setUser(data.user);
      await fetchUserProfile(data.user.id);
      await fetchAds();
    }

    navigateTo("/dashboard");
  };
  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      await fetchAds();

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setUser(data.session.user);
        await fetchUserProfile(data.session.user.id);
      }

      setLoading(false);
    };

    init();
  }, []);

  if (loading) {

    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "'Inter', sans-serif" }}>Chargement...</div>;
  }

  if (subscriptionStatus === "blocked") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8fafc",
          flexDirection: "column",
          textAlign: "center",
          padding: "20px"
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            maxWidth: "420px",
            width: "100%"
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "15px" }}>
            🚫
          </div>

          <h1
            style={{
              fontSize: "28px",
              marginBottom: "10px",
              color: "#0f172a"
            }}
          >
            Compte suspendu
          </h1>

          <p
            style={{
              color: "#64748b",
              lineHeight: "1.6"
            }}
          >
            Votre accès à la plateforme a été temporairement suspendu
            par l’administration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div id="root" style={{ position: "relative" }}>

        {/* 🔔 NOTIFICATION GLOBALE */}
        {showReminder && (
          <div style={{
            position: "fixed",
            top: 10,
            left: 0,
            right: 0,
            margin: "auto",
            width: "90%",
            maxWidth: "500px",
            background: "#f59e0b",
            color: "#fff",
            padding: "12px 20px",
            textAlign: "center",
            zIndex: 9999,
            borderRadius: "12px",
            fontWeight: "700",
            boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)"
          }}>
            🔔 Rappel : paiement de l’abonnement prévu le 10 du mois
          </div>
        )}

        {/* ================= ROUTES ================= */}
        <Routes>
          <Route path="/" element={<Home ads={ads} user={user} profile={profile} />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/messages" element={<MessagesList />} />
          <Route path="/cart" element={<Cart user={user} />} />

          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/chat" element={<MessagesList />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/tracking/:orderId" element={<TrackingPage />} />
          <Route path="/livreur" element={<LivreurPage />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders user={user} />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/admin/analytics" element={<Analytics />} />

          {/* USERS & ROLES */}
          <Route path="/users/roles" element={<Roles />} />
          <Route path="/users/blocked" element={<BlockedUsers />} />

          {/* ORDERS */}
          <Route path="/admin/orders" element={<OrdersAll />} />
          <Route path="/admin/orders/pending" element={<OrdersPending />} />
          <Route path="/admin/orders/paid" element={<OrdersPaid />} />
          <Route path="/admin/orders/shipping" element={<OrdersShipping />} />

          {/* BUSINESS */}
          <Route path="/admin/sales" element={<Sales />} />
          <Route path="/admin/revenue" element={<Revenue />} />
          <Route path="/admin/stats" element={<Stats />} />

          {/* STORE */}
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/categories" element={<Categories />} />

          {/* SYSTEM */}
          <Route path="/admin/security" element={<Security />} />

          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/marketplace" element={<Marketplace />} />
          <Route path="/admin/moderation" element={<AdminModeration />} />
          <Route
            path="/admin/reviews"
            element={<AdminReviews />}
          />

          <Route
            path="/login"
            element={
              <LoginView
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLoginSubmit={handleLoginSubmit}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                user={user}
                profile={profile}
                ads={ads}
                fetchAds={fetchAds}
              />
            }
          />

          <Route path="/chat/:conversationId" element={<Chat />} />
        </Routes>

      </div>
    </Router>
  );
}

function LoginView({ email, setEmail, password, setPassword, handleLoginSubmit }) {
  const navigate = useNavigate();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  return (
    <div style={styles.authWrapper}>
      <div style={styles.authCard}>
        <div style={styles.authHeader}>
          <div style={styles.corporateLogo}>📦</div>
          <h2 style={styles.authTitle}>
            {isSignUpMode ? "Créer un espace" : "Bienvenue"}
          </h2>
          <p style={styles.authSubtitle}>
            {isSignUpMode ? "Inscrivez votre micro-boutique en ligne" : "Connectez-vous à votre espace marchand"}
          </p>
        </div>

        <form
          style={{ ...styles.authForm, display: "flex", flexDirection: "column", gap: "16px" }}
          onSubmit={(e) => handleLoginSubmit(e, navigate, isSignUpMode)}
        >
          <input
            style={styles.proInput}
            type="email"
            placeholder="Adresse e-mail *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.proInput}
            type="password"
            placeholder="Mot de passe *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={{ ...styles.proBtnPrimary, width: "100%", cursor: "pointer" }}>
            {isSignUpMode ? "S'inscrire et Ouvrir ma boutique" : "Se connecter"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => setIsSignUpMode(!isSignUpMode)}
            style={{
              background: "none", border: "none", color: "#4f46e5",
              cursor: "pointer", fontSize: "14px", fontWeight: "600", textDecoration: "underline"
            }}
          >
            {isSignUpMode ? "Déjà un compte ? Connectez-vous" : "Nouveau vendeur ? Créez un compte ici"}
          </button>
        </div>
      </div>
    </div>
  );
}

const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

const styles = {
  dashboardLayout: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    padding: isMobile ? "10px" : "0px",
    boxSizing: "border-box"
  },
  sidebar: {
    width: isMobile ? "100%" : "310px",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    borderRight: isMobile ? "none" : "1px solid rgba(226, 232, 240, 0.8)",
    borderBottom: isMobile ? "1px solid rgba(226, 232, 240, 0.8)" : "none",
    padding: isMobile ? "20px 10px" : "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    boxSizing: "border-box",
    flexShrink: 0
  },
  userCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px 20px",
    textAlign: "center",
    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.05), 0 8px 16px -6px rgba(0, 0, 0, 0.02)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    boxSizing: "border-box"
  },
  avatarContainer: {
    position: "relative",
    width: "90px",
    height: "90px",
    marginBottom: "16px"
  },
  avatarLabel: {
    position: "relative",
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius: "32px",
    cursor: "pointer",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.15)",
    margin: "0 auto"
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    border: "2px solid #ffffff",
    boxSizing: "border-box"
  },
  avatarOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(15, 23, 42, 0.65)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#ffffff", fontSize: "20px", opacity: 0, transition: "all 0.23s ease-in-out"
  },
  onlineStatusBadge: {
    position: "absolute", bottom: "-2px", right: "-2px",
    width: "16px", height: "16px", background: "#10b981",
    borderRadius: "50%", border: "3px solid #ffffff",
    boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
    boxSizing: "border-box",
    zIndex: 2
  },
  profileContent: {
    width: "100%", display: "flex", flexDirection: "column", alignItems: "center"
  },
  profileRoleBadge: {
    background: "linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%)",
    color: "#4338ca", fontSize: "11px", fontWeight: "800", padding: "5px 14px",
    borderRadius: "12px", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.8px"
  },
  inputGroup: {
    width: "100%", textAlign: "left", marginBottom: "20px", boxSizing: "border-box"
  },
  fieldLabel: {
    display: "block", fontSize: "11px", fontWeight: "700", color: "#94a3b8",
    marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px"
  },
  usernameInput: {
    width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #e2e8f0",
    fontSize: "14px", fontWeight: "600", color: "#0f172a", background: "#f8fafc",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit"
  },
  actionGroup: {
    width: "100%", display: "flex", flexDirection: "column", gap: "12px"
  },
  saveProfileBtn: {
    width: "100%", background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
    color: "#ffffff", border: "none", padding: "14px", borderRadius: "14px",
    cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 6px 20px rgba(79, 70, 229, 0.2)",
    fontFamily: "inherit", transition: "opacity 0.2s"
  },
  logoutProfileBtn: {
    width: "100%", background: "none", border: "1px solid #fee2e2", color: "#ef4444",
    padding: "12px", borderRadius: "14px", cursor: "pointer", fontWeight: "600", fontSize: "13px",
    fontFamily: "inherit", transition: "all 0.2s"
  },
  sidebarModule: {
    background: "#ffffff", padding: "20px", borderRadius: "20px",
    boxShadow: "0 4px 18px rgba(0, 0, 0, 0.02)", border: "1px solid rgba(241, 245, 249, 0.8)", boxSizing: "border-box"
  },
  moduleTitle: {
    margin: "0 0 16px 0", fontSize: "15px", fontWeight: "700", color: "#1e293b", letterSpacing: "-0.3px"
  },
  verticalForm: {
    display: "flex", flexDirection: "column", gap: "14px"
  },
  sidebarInput: {
    width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0",
    background: "#f8fafc", fontSize: "14px", boxSizing: "border-box", outline: "none", fontFamily: "inherit"
  },
  sidebarTextarea: {
    width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0",
    background: "#f8fafc", fontSize: "14px", minHeight: "120px", maxHeight: "300px",
    overflowY: "auto", resize: "vertical", boxSizing: "border-box", outline: "none", lineHeight: "1.5", fontFamily: "inherit"
  },
  uploadZone: {
    padding: "16px", border: "2px dashed #cbd5e1", borderRadius: "12px",
    textAlign: "center", fontSize: "13px", color: "#64748b", fontWeight: "600",
    cursor: "pointer", background: "#fafafa", boxSizing: "border-box"
  },
  mainContent: {
    flex: 1, padding: isMobile ? "24px 10px" : "50px 40px", width: "100%", boxSizing: "border-box",
    minWidth: 0
  },
  viewPort: {
    maxWidth: "1200px", margin: "0 auto", width: "100%"
  },
  viewHeader: {
    marginBottom: "36px", textAlign: isMobile ? "center" : "left"
  },
  mainTitle: {
    margin: 0, fontSize: isMobile ? "24px" : "32px", fontWeight: "800", color: "#0f172a", letterSpacing: "-1px"
  },
  mainSubtitle: {
    margin: "6px 0 0 0", fontSize: "15px", color: "#64748b", fontWeight: "500"
  },
  cleanGrid: {
    display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(290px, 1fr))", gap: "20px", width: "100%"
  },
  cleanCard: {
    background: "#ffffff", borderRadius: "24px", overflow: "hidden", display: "flex",
    flexDirection: "column", boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(241, 245, 249, 0.9)", width: "100%", boxSizing: "border-box"
  },
  /* ===== MODIFICATION ICI ===== */
  cardImageContainer: {
    height: "130px", // Réduit de 190px à 130px pour un format plus équilibré et compact
    background: "#f1f5f9",
    position: "relative",
    width: "100%"
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover" // Recadre proprement sans déformer le visuel
  },
  emptyImgFallback: {
    height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "13px", fontWeight: "500"
  },
  cardBody: {
    padding: "20px", display: "flex", flexDirection: "column", flex: 1, boxSizing: "border-box"
  },
  cardHeaderRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "10px"
  },
  cardTitle: {
    margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.3px", lineHeight: "1.4"
  },
  cardPrice: {
    fontSize: "15px", fontWeight: "800", color: "#10b981", whiteSpace: "nowrap", background: "#e6f4ea", padding: "4px 10px", borderRadius: "10px"
  },
  cardDescription: {
    margin: "0 0 20px 0", fontSize: "13.5px", color: "#64748b", lineHeight: "1.6", flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word", height: "auto"
  },
  cardFooter: {
    borderTop: "1px solid #f8fafc", paddingTop: "16px", marginTop: "auto"
  },
  cardActionGroup: {
    display: "flex", gap: "10px"
  },
  btnIconEdit: {
    flex: 1, padding: "10px", background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit"
  },
  btnIconDelete: {
    padding: "10px 14px", color: "#ef4444", background: "#fef2f2", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit"
  },
  authWrapper: {
    display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc", padding: "20px", boxSizing: "border-box"
  },
  authCard: {
    background: "#ffffff", padding: "40px 30px", borderRadius: "24px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", boxSizing: "border-box"
  },
  authHeader: {
    textAlign: "center", marginBottom: "32px"
  },
  corporateLogo: {
    fontSize: "40px", marginBottom: "12px"
  },
  authTitle: {
    margin: "0 0 6px 0", fontSize: "24px", fontWeight: "800", color: "#0f172a"
  },
  authSubtitle: {
    margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "500"
  },
  proInput: {
    width: "100%", padding: "14px 16px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "15px", outline: "none", boxSizing: "border-box", fontFamily: "inherit"
  },
  proBtnPrimary: {
    width: "100%", background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)", color: "#ffffff", border: "none", padding: "14px", borderRadius: "14px", fontWeight: "700", fontSize: "15px", boxShadow: "0 6px 20px rgba(79, 70, 229, 0.23)", cursor: "pointer", fontFamily: "inherit", boxSizing: "border-box"
  },
  proBtnSecondary: {
    width: "100%", background: "none", color: "#64748b", border: "1px solid #e2e8f0", padding: "12px", borderRadius: "14px", fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit", boxSizing: "border-box"
  }
};