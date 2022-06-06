import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { clearStorage, getToken, getUserID } from "../../AsyncStorageHandles";
import MyAuctionsList from "../components/MyAuctionsList";
import Loading from "./Loading";
import { windowHeight, windowWidth } from "../../Dimensions";

const baseUrl = "http://192.168.31.95:8000";

const MyAuctions = (props) => {
  const [user, setUser] = useState("");
  const [auctions, setAuctions] = useState([]);
  console.log(user);

  useEffect(() => {
    getUserID().then((res) => {
      axios
        .get(`${baseUrl}/users/${res}/auctions`)
        .then((res) => setAuctions(res.data.auctions))
        .catch((err) => console.log(err));
    });
  }, []);
  return (
    <View style={styles.container}>
      <MyAuctionsList data={auctions} />
      {/* {auctions.map((item) => (
        <Text>{item}</Text>
      ))} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    paddingBottom: 100,
  },
});

export default MyAuctions;
