import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { clearStorage, getToken, getUserID } from "../../AsyncStorageHandles";
import MyBidsList from "../components/MyBidsList";
import Loading from "./Loading";
import { windowHeight, windowWidth } from "../../Dimensions";

const baseUrl = "http://192.168.31.95:8000";

const MyBids = (props) => {
  const [user, setUser] = useState("");
  const [bids, setBids] = useState([]);

  useEffect(() => {
    getUserID().then((res) => {
      console.log(res);
      axios
        .get(`${baseUrl}/users/${res}/bids`)
        .then((res) => setBids(res.data.bids))
        .catch((err) => console.log(err.message));
    });
  }, []);
  return (
    <View style={styles.container}>
      <MyBidsList data={bids} />
      {/* {bids.map((item) => (
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

export default MyBids;
