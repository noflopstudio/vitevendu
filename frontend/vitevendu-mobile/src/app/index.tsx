import { View, Text, FlatList, TouchableOpacity } from "react-native";

const products = [
  { id: "1", name: "Chaussures Nike", price: "15 000 FCFA" },
  { id: "2", name: "Sac moderne", price: "8 500 FCFA" },
  { id: "3", name: "iPhone 11", price: "120 000 FCFA" },
];

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 20 }}>

      {/* HEADER */}
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>
        🔥 ViteVendu
      </Text>

      <Text style={{ color: "#64748b", marginBottom: 20 }}>
        Marketplace locale Côte d'Ivoire
      </Text>

      {/* LISTE PRODUITS */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#e2e8f0",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ color: "#4f46e5", marginTop: 5 }}>
              {item.price}
            </Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}