import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Auction from "./src/screens/Auction";
import Feed from "./src/screens/Feed";
import LoginScreen from "./src/screens/LoginScreen";
import Bid from "./src/components/Bid";
import RegisterScreen from "./src/screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { getToken, getUserID } from "./AsyncStorageHandles";
import AddAuction from "./src/screens/AddAuction";

const AppStack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState();
  const [readToken, setReadToken] = useState(false);
  const [signedInUser, setSignedInUser] = useState("");

  const reReadToken = () => {
    setReadToken((lastState) => !lastState);
  };

  useEffect(() => {
    getToken().then((res) => {
      setToken(res);
    });
    getUserID().then((res) => {
      setSignedInUser(res);
    });
  }, [readToken]);

  if (token) {
    return <AddAuction />;
    // return (
    //   <NavigationContainer style={styles.container}>
    //     <AppStack.Navigator initialRouteName="Feed">
    //       <AppStack.Screen
    //         name="Feed"
    //         component={Feed}
    //         initialParams={{
    //           reReadToken: reReadToken,
    //           signedInUser: signedInUser,
    //         }}
    //       />
    //       <AppStack.Screen name="Auction" component={Auction} />

    //       {console.log(signedInUser)}
    //     </AppStack.Navigator>
    //   </NavigationContainer>
    // );
  }
  return (
    <NavigationContainer style={styles.container}>
      <AppStack.Navigator initialRouteName="LoginScreen">
        <AppStack.Screen
          name="Login"
          component={LoginScreen}
          initialParams={{
            reReadToken: reReadToken,
          }}
        />
        <AppStack.Screen name="RegisterScreen" component={RegisterScreen} />
        {/* <LoginScreen reReadToken={reReadToken} /> */}
      </AppStack.Navigator>
    </NavigationContainer>
  );
  // return <RegisterScreen />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(220, 220, 220)",
    height: "100%",
  },
});
