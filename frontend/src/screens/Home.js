import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auction from "./Auction";
import Feed from "./Feed";
import { getToken, getUserID } from "../../AsyncStorageHandles";
import React, { useState, useEffect } from "react";

const HomeStack = createNativeStackNavigator();
const Home = (props) => {
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
  return (
    <NavigationContainer style={styles.container} independent={true}>
      <HomeStack.Navigator initialRouteName="Feed">
        <HomeStack.Screen
          name="Feed"
          component={Feed}
          initialParams={{
            reReadToken: props.route.params.reReadToken,
            signedInUser: signedInUser,
          }}
        />
        <HomeStack.Screen name="Auction" component={Auction} />

        {console.log(signedInUser)}
      </HomeStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(220, 220, 220)",
    height: "100%",
  },
});

export default Home;
