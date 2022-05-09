import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import AuthInput from "../components/AuthInput";
import { windowWidth, windowHeight } from "../../Dimensions";
import Btn from "../components/Btn";
import axios from "axios";
import { storeToken, storeUserID } from "../../AsyncStorageHandles";
const baseUrl = "http://192.168.0.174:8000";
const baseUrlAlternate = "http://10.100.102.12:8000";

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboard, setKeyboard] = useState(false);
  const [user, setUser] = useState("");

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
          console.log(props.route.params);
          storeUserID(response.data.user).then(() => {
            props.route.params.reReadToken();
          });
        });
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  const unsignedHandler = (input) => {
    props.navigation.navigate("RegisterScreen", input);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={{
          marginTop: keyboard ? windowHeight * 0.2 : windowHeight * 0.25,
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
          returnKeyType="done"
          onChangeText={(input) => setEmail(input)}
        />
        <AuthInput
          placeholder="Password"
          secureTextEntry={true}
          returnKeyType="done"
          onChangeText={(input) => setPassword(input)}
        />
        <Btn onPress={onPressHandler} title="Login" />
      </View>
      <Text style={styles.text}>Do not have an account?</Text>
      <TouchableOpacity onPress={unsignedHandler}>
        <Text style={styles.unsigned}>Click Here</Text>
      </TouchableOpacity>
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
  unsigned: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
    color: "navy",
  },
  text: {
    color: "grey",
    marginTop: 20,
    fontSize: 18,
  },
});

export default LoginScreen;
