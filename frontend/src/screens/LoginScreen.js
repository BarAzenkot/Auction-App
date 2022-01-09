import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";
import AuthInput from "../components/AuthInput";
import { windowWidth, windowHeight } from "../../Dimensions";
import Btn from "../components/Btn";
import axios from "axios";
import { storeToken } from "../../AsyncStorageHandles";
const baseUrl = "http://172.20.8.235:8000";

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      email: email,
      password: password,
    };

    var config = {
      method: "post",
      url: `${baseUrl}/users/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        storeToken(response.data.token).then(() => {
          props.reReadToken();
        });
        // localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={{
          marginTop: keyboard ? windowHeight * 0.35 : windowHeight * 0.4,
          backgroundColor: "grey",
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          width: windowWidth * 0.8,
        }}
      >
        <AuthInput
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(input) => setEmail(input)}
          returnKeyType="done"
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
