import React, { useState, useEffect } from "react";
import AuthInput from "../components/AuthInput";
import { windowWidth, windowHeight } from "../../Dimensions";
import Btn from "../components/Btn";
import axios from "axios";
import { View, StyleSheet, Keyboard } from "react-native";
const baseUrl = "http://192.168.31.95:8000";
const baseUrlAlternate = "http://10.100.102.12:8000";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboard(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onPressHandler = () => {
    var data = {
      username: username,
      password: password,
      email: email,
      fullName: fullName,
    };

    var config = {
      method: "post",
      url: `${baseUrl}/users/signup`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={{
          marginTop: keyboard ? windowHeight * 0.1 : windowHeight * 0.2,
          backgroundColor: "grey",
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          width: windowWidth * 0.8,
        }}
      >
        <AuthInput
          placeholder="Email"
          placeholderTextColor="grey"
          keyboardType="email-address"
          returnKeyType="done"
          onChangeText={(input) => setEmail(input)}
        />
        <AuthInput
          placeholder="Password"
          placeholderTextColor="grey"
          secureTextEntry={true}
          returnKeyType="done"
          onChangeText={(input) => setPassword(input)}
        />
        <AuthInput
          placeholder="Username"
          placeholderTextColor="grey"
          returnKeyType="done"
          onChangeText={(input) => setUsername(input)}
        />
        <AuthInput
          placeholder="Full Name"
          placeholderTextColor="grey"
          returnKeyType="done"
          onChangeText={(input) => setFullName(input)}
        />
        <Btn title="Register" onPress={onPressHandler} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
});

export default RegisterScreen;
