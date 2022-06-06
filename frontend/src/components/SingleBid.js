import { View, Text, StyleSheet } from "react-native";
import React from "react";
import MyAuctionsList from "./MyAuctionsList";

const SingleBid = ({ data }) => {
  console.log("dfdfdfdfdfddfdf", [data.auction]);
  return (
    <View
      style={{
        ...styles.container,
      }}
    >
      <Text style={styles.title}>{data.amount}$</Text>
      <Text style={styles.text}>
        Placed at: {data.date.split("T")[0]} |{" "}
        {data.date.split("T")[1].split(".")[0]}
        {/* <MyAuctionsList data={[data.auction]} /> */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
  },
  title: {
    fontSize: 26,
  },
});

export default SingleBid;
