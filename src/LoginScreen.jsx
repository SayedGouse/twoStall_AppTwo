import axios from "axios";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Base_url } from "./Base_URL";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  const handleLogin = async () => {
    // Handle login logic here
    try {
      if (email && password) {
        setLoading(true); // Start loader
        const res = await axios.post(`${Base_url}/userAppointment/login`, {
          email:email,
          Password: password,
        });
        if (res.status === 200) {
          AsyncStorage.setItem("email", email);
          Alert.alert("Success", "Login successful!");
          navigation.navigate("Tab", { screen: "Book_Appointment" });
        }
      } else {
        Alert.alert("Error", "Please fill in all fields!");
        return;
      }
    } catch (error) {
      Alert.alert("Error", "Invalid email or password!");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6c757d"
        value={email}
        keyboardType="email-address"
        onChangeText={(value) => setEmail(value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6c757d"
        value={password}
        secureTextEntry={true}
        onChangeText={(value) => setPassword(value)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    color: "black",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    color: "#007BFF",
  },
});
