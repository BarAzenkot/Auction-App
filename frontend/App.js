import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Auction from "./src/screens/Auction";
import Feed from "./src/screens/Feed";
import LoginScreen from "./src/screens/LoginScreen";
import Bid from "./src/components/Bid";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { getToken } from "./AsyncStorageHandles";

const AppStack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState();
  const [readToken, setReadToken] = useState(false);
  // removeToken();

  const reReadToken = () => {
    setReadToken((lastState) => !lastState);
  };

  useEffect(() => {
    getToken().then((res) => {
      setToken(res);
    });
  }, [readToken]);

  if (token) {
    return (
      <NavigationContainer style={styles.container}>
        <AppStack.Navigator initialRouteName="Feed">
          <AppStack.Screen
            name="Feed"
            component={Feed}
            initialParams={{ reReadToken: reReadToken }}
          />
          <AppStack.Screen name="Auction" component={Auction} />
          <AppStack.Screen name="Bid" component={Bid} />
        </AppStack.Navigator>
      </NavigationContainer>
    );
  }
  return <LoginScreen reReadToken={reReadToken} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(220, 220, 220)",
    height: "100%",
  },
});
