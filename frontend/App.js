import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Auction from "./src/screens/Auction";
import Feed from "./src/screens/Feed";
import LoginScreen from "./src/screens/LoginScreen";
import Bid from "./src/components/Bid";
import RegisterScreen from "./src/screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { clearStorage, getToken, getUserID } from "./AsyncStorageHandles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddAuction from "./src/screens/AddAuction";
import ChargeCoins from "./src/screens/ChargeCoins";
import Home from "./src/screens/Home";
import Btn from "./src/components/Btn";
import MyAuctions from "./src/screens/MyAuctions";
import MyBids from "./src/screens/MyBids";

const AppStack = createNativeStackNavigator();
const AppTab = createMaterialBottomTabNavigator();

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
    // return <ChargeCoins />;
    return (
      <NavigationContainer>
        <AppTab.Navigator initialRouteName="Home" activeColor="black">
          <AppTab.Screen
            name="Home"
            component={Home}
            initialParams={{
              reReadToken: reReadToken,
            }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={color}
                  size={23}
                />
              ),
            }}
          />
          <AppTab.Screen
            name="Wallet"
            component={ChargeCoins}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="wallet-outline"
                  color={color}
                  size={23}
                />
              ),
            }}
          />
          <AppTab.Screen
            name="List An Item"
            component={AddAuction}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="plus-box-outline"
                  color={color}
                  size={23}
                />
              ),
            }}
          />
          <AppTab.Screen
            name="My Auctions"
            component={MyAuctions}
            initialParams={{ signedInUser: signedInUser }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="layers-triple-outline"
                  color={color}
                  size={23}
                />
              ),
            }}
          />
          <AppTab.Screen
            name="My Bids"
            component={MyBids}
            initialParams={{ signedInUser: signedInUser }}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="hammer" color={color} size={23} />
              ),
            }}
          />
        </AppTab.Navigator>
      </NavigationContainer>
    );
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
