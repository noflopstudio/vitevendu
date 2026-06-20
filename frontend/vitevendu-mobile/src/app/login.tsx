import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Login() {
    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>

            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
                Connexion ViteVendu
            </Text>

            <TextInput placeholder="Email" style={inputStyle} />
            <TextInput placeholder="Mot de passe" secureTextEntry style={inputStyle} />

            <TouchableOpacity style={btnStyle}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
                    Se connecter
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
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 10,
};