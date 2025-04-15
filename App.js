import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";

export default function App() {
  const [tela, setTela] = useState("inicio");
  const [nome, setNome] = useState("");
  const [versiculo, setVersiculo] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mostrarAcoes, setMostrarAcoes] = useState(false);
  const scrollViewRef = useRef();

  const API_URL = "https://oraculo-api.vercel.app/api/mensagem";

  const handleEnviar = async () => {
    if (!versiculo) return;
    setCarregando(true);
    const novaMensagem = { tipo: "usuario", texto: versiculo };
    setMensagens((prev) => [...prev, novaMensagem]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versiculo }),
      });

      const data = await response.json();
      const saudacao = nome ? `${nome}, ` : "";
      const resposta = { tipo: "bot", texto: saudacao + data.resposta };
      setMensagens((prev) => [...prev, resposta]);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMensagens((prev) => [
        ...prev,
        {
          tipo: "bot",
          texto: "Não foi possível se conectar ao Céu. Tente novamente.",
        },
      ]);
    }

    setCarregando(false);
    setVersiculo("");
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [mensagens]);

  const copiarPix = () => {
    const chavePix =
      "00020126580014BR.GOV.BCB.PIX0136f7b44974-7a9f-4253-bdd0-f37341d11e9f5204000053039865802BR5917Guilherme Tebaldi6009SAO PAULO62140510pwLVivMCvr630433FD";
    Clipboard.setStringAsync(chavePix);
    Alert.alert("PIX copiado!", "A chave PIX foi copiada para sua área de transferência.");
  };

  if (tela === "inicio") {
    return (
      <View style={{ flex: 1, backgroundColor: "#111827", justifyContent: "center", alignItems: "center", padding: 20 }}>
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#10B981", marginBottom: 20 }}>
          Bem-vindo ao Oráculo
        </Text>

        <TouchableOpacity
          onPress={() => setTela("chat")}
          style={{ backgroundColor: "#10B981", padding: 16, borderRadius: 12, width: "80%", marginBottom: 12 }}
        >
          <Text style={{ color: "#fff", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>💬 Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMostrarAcoes(!mostrarAcoes)}
          style={{ backgroundColor: "#374151", padding: 16, borderRadius: 12, width: "80%" }}
        >
          <Text style={{ color: "#fff", fontSize: 18, textAlign: "center", fontWeight: "bold" }}>⚙️ Ações</Text>
        </TouchableOpacity>

        {mostrarAcoes && (
          <View style={{ marginTop: 20, gap: 12, width: "100%", alignItems: "center" }}>
            <TouchableOpacity
              onPress={copiarPix}
              style={{ backgroundColor: "#1F2937", padding: 12, borderRadius: 10, width: "80%" }}
            >
              <Text style={{ color: "#10B981", fontSize: 16, textAlign: "center" }}>📤 Ofertar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#111827", padding: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <Text style={{ fontSize: 26, fontWeight: "bold", color: "#10B981", textAlign: "center", marginBottom: 6 }}>
        Chat com Deus
      </Text>
      <Text style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", marginBottom: 20 }}>
        Escreva o versículo que você abriu na Bíblia, e receba a resposta de Deus.
      </Text>

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, marginBottom: 20 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
      >
        {mensagens.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf: msg.tipo === "usuario" ? "flex-end" : "flex-start",
              backgroundColor: msg.tipo === "usuario" ? "#059669" : "#374151",
              borderRadius: 16,
              padding: 12,
              maxWidth: "80%",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, lineHeight: 20 }}>{msg.texto}</Text>
          </View>
        ))}
        {carregando && <ActivityIndicator size="large" color="#10B981" />}
      </ScrollView>

      <TextInput
        placeholder="Seu nome (opcional)"
        placeholderTextColor="#6B7280"
        value={nome}
        onChangeText={setNome}
        style={{
          backgroundColor: "#1F2937",
          color: "#fff",
          borderRadius: 10,
          padding: 12,
          borderColor: "#374151",
          borderWidth: 1,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Ex: Jeremias 29:11"
        placeholderTextColor="#6B7280"
        value={versiculo}
        onChangeText={setVersiculo}
        style={{
          backgroundColor: "#1F2937",
          color: "#fff",
          borderRadius: 10,
          padding: 12,
          borderColor: "#374151",
          borderWidth: 1,
          marginBottom: 12,
        }}
      />
      <TouchableOpacity
        onPress={handleEnviar}
        style={{
          backgroundColor: "#10B981",
          padding: 14,
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "bold" }}>
          ✨ Fala comigo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setTela("inicio")} style={{ padding: 10 }}>
        <Text style={{ textAlign: "center", color: "#9CA3AF" }}>⬅️ Voltar</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", marginBottom: 20 }}>
        Por: Guilherme Tebaldi.
      </Text>
    </KeyboardAvoidingView>
  );
}
