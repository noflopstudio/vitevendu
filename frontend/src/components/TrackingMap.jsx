import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// ==========================================
// 🎨 CONFIGURATION DES ICÔNES (Anti-Bug Vite)
// ==========================================
// Icône Livreur (Orange Foncé)
const driverIcon = L.divIcon({
    html: `<div style="font-size: 28px; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">🚚</div>`,
    className: "custom-marker-driver",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

// Icône Client (Vert Foncé)
const clientIcon = L.divIcon({
    html: `<div style="font-size: 28px; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">📍</div>`,
    className: "custom-marker-client",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

// ==========================================
// 🧭 ROUTE SAFE COMPONENT (Optimisé Live)
// ==========================================
function RouteLine({ from, to }) {
    const map = useMap();
    const routeControlRef = useRef(null);

    useEffect(() => {
        if (!map || !from || !to) return;

        // Si le contrôleur n'existe pas encore, on le crée une bonne fois pour toutes
        if (!routeControlRef.current) {
            routeControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(from[0], from[1]),
                    L.latLng(to[0], to[1]),
                ],
                lineOptions: {
                    // Utilisation de ton orange foncé pro pour tracer le chemin
                    styles: [{ color: "#c2410c", weight: 5, opacity: 0.85 }],
                },
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: false, // Évite que la carte ne "saute" à chaque micro-déplacement
                show: false, // Cache le panneau de texte des directions
                serviceUrl: "https://router.project-osrm.org/route/v1"
            }).addTo(map);
        } else {
            // 🔥 Si le contrôleur existe déjà, on met juste à jour les points. 
            // C'est ça qui rend le déplacement FLUIDE et ultra-pro !
            routeControlRef.current.setWaypoints([
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1])
            ]);
        }

        // Nettoyage complet si on quitte la page
        return () => {
            if (routeControlRef.current) {
                try {
                    map.removeControl(routeControlRef.current);
                    routeControlRef.current = null;
                } catch (e) {
                    console.log("Erreur lors du nettoyage de la route", e);
                }
            }
        };
    }, [map, from, to]);

    return null;
}

// ==========================================
// 🚚 TRACKING MAP COMPONENT
// ==========================================
export default function TrackingMap({ orderId }) {
    // Coordonnées de départ par défaut (Ex: Abidjan)
    const [driverPos, setDriverPos] = useState([5.3484, -4.0267]);
    const [clientPos, setClientPos] = useState([5.3200, -4.0200]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // 📥 CHARGEMENT INITIAL DES COORDONNÉES
    // ==========================================
    useEffect(() => {
        const fetchInitialPositions = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("driver_lat, driver_lng, client_lat, client_lng")
                .eq("id", orderId)
                .single();

            if (!error && data) {
                if (data.driver_lat && data.driver_lng) {
                    setDriverPos([data.driver_lat, data.driver_lng]);
                }
                if (data.client_lat && data.client_lng) {
                    setClientPos([data.client_lat, data.client_lng]);
                }
            }
            setLoading(false);
        };

        fetchInitialPositions();
    }, [orderId]);

    // ==========================================
    // 📡 SYNC POSITION DU LIVREUR EN TEMPS RÉEL
    // ==========================================
    useEffect(() => {
        const channel = supabase
            .channel(`driver-live-${orderId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "orders",
                    filter: `id=eq.${orderId}`
                },
                (payload) => {
                    const data = payload.new;
                    if (data.driver_lat && data.driver_lng) {
                        // Met à jour la position de l'icône et de la route instantanément
                        setDriverPos([data.driver_lat, data.driver_lng]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);

    if (loading) {
        return (
            <div style={styles.loaderContainer}>
                <div style={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div style={styles.mapWrapper}>
            <MapContainer
                center={clientPos}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false} // On cache pour faire un design plus "App mobile"
            >
                {/* 🗺️ fond de carte blanc / gris épuré (CartoDB Light) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* 🚚 LIVREUR AVEC ICÔNE DIV */}
                <Marker position={driverPos} icon={driverIcon}>
                    <Popup>
                        <div style={styles.popupText}><b>Livreur en déplacement</b></div>
                    </Popup>
                </Marker>

                {/* 🏠 CLIENT AVEC ICÔNE DIV */}
                <Marker position={clientPos} icon={clientIcon}>
                    <Popup>
                        <div style={styles.popupText}><b>Votre point de livraison</b></div>
                    </Popup>
                </Marker>

                {/* 🧭 CALCUL ET TRACÉ EN DIRECT */}
                <RouteLine from={driverPos} to={clientPos} />
            </MapContainer>

            {/* CARD FLOTTANTE ULTRA PRO */}
            <div style={styles.floatingCard}>
                <div style={styles.statusDot}></div>
                <div>
                    <h4 style={styles.cardTitle}>Suivi de la livraison</h4>
                    <p style={styles.cardSubtitle}>Le livreur se dirige vers ta position</p>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 🎨 DESIGN SYSTEM : PRO, PROPRE & ACCENTS
// ==========================================
const styles = {
    mapWrapper: {
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden"
    },
    floatingCard: {
        position: "absolute",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "#ffffff",
        padding: "16px 24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(17, 24, 39, 0.15)",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        width: "calc(100% - 40px)",
        maxWidth: "400px",
        boxSizing: "border-box"
    },
    statusDot: {
        width: "10px",
        height: "10px",
        background: "#15803d", // Vert foncé pour le voyant
        borderRadius: "50%",
        animation: "pulse 1.5s infinite"
    },
    cardTitle: {
        margin: 0,
        fontSize: "14px",
        fontWeight: "800",
        color: "#111827" // Noir profond
    },
    cardSubtitle: {
        margin: "2px 0 0 0",
        fontSize: "12px",
        color: "#6b7280",
        fontWeight: "500"
    },
    popupText: {
        fontFamily: "system-ui, sans-serif",
        fontSize: "12px",
        color: "#111827"
    },
    loaderContainer: {
        height: "100vh",
        width: "100vw",
        background: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    spinner: {
        width: "28px",
        height: "28px",
        border: "2px solid #e5e7eb",
        borderTopColor: "#111827",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
    }
};