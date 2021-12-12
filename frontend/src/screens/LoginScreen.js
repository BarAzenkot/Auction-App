import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import AuthInput from "../components/AuthInput";
import { windowWidth, windowHeight } from "../../Dimensions";
import Btn from "../components/Btn";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onPressHandler = () => {
    console.log(email, password);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <AuthInput
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(input) => setEmail(input)}
        />
        <AuthInput
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(input) => setPassword(input)}
        />
        <Btn onPress={onPressHandler} title="Login" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: windowHeight * 0.4,
    backgroundColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: windowWidth * 0.8,
  },
  wrapper: {
    textAlign: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
