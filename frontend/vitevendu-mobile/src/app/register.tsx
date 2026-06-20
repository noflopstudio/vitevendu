import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Register() {
    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>

            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
                Créer un compte ViteVendu
            </Text>

            <TextInput placeholder="Nom complet" style={inputStyle} />
            <TextInput placeholder="Email" style={inputStyle} />
            <TextInput placeholder="WhatsApp" style={inputStyle} />
            <TextInput placeholder="Mot de passe" secureTextEntry style={inputStyle} />

            <TouchableOpacity style={btnStyle}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                    S'inscrire
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const inputStyle = {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
};

const btnStyle = {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 10,
};